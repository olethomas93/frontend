/**
 * POST /api/webmi/widget-template
 *
 * Body: { widget: string; scaleToMax?: boolean }
 *
 * Fetches an Atvise SVG widget via CtrlGetWidget, transforms the XML/SVG
 * entirely on the server using linkedom (no browser DOMParser needed), and
 * returns a ready-to-use Vue template string together with the processed
 * script and extracted parameters.
 *
 * The client (atviseVisuV3.vue) then only needs to:
 *   1. Apply user-language translations  (needs Pinia store)
 *   2. Apply {{substitute}} replacements  (needs runtime arg values)
 *   3. Wrap the script in `new Function` and build the Vue component
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { parseHTML } from 'linkedom'
import { atviseCustomRequest } from '~/server/utils/atvise'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AtviseWidgetResponse {
  html?: string
  result?: string
  script?: string
}

export interface WidgetParameter {
  name: string
  defaultvalue?: string
  valuetype?: string
  substitute?: string
  [key: string]: string | undefined
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    widget?: string
    html?: string
    script?: string
    scaleToMax?: boolean
  }>(event)

  console.log('[widget-template] POST received – body keys:', Object.keys(body))

  let rawHtml: string
  let rawScript: string

  if (body.html !== undefined) {
    // Preferred path: the browser pre-fetched CtrlGetWidget with its own
    // webMI session.  The webMI session cookie has path=/webMI/ so it is
    // not forwarded when the browser calls /api/* — the server cannot make
    // an authenticated request on behalf of the browser.
    rawHtml = body.html
    rawScript = body.script ?? ''
    console.log('[widget-template] Browser-supplied html – htmlLen:', rawHtml.length, 'scriptLen:', rawScript.length)
    if (!rawHtml) {
      console.warn('[widget-template] WARNING: html is empty – the browser CtrlGetWidget fetch returned nothing.')
    }
  } else if (body.widget) {
    // Legacy server-fetch path — works when ATVISE_PROXY and cookie
    // forwarding are both configured correctly (trusted server context).
    console.log('[widget-template] Server-fetch path for widget:', body.widget)
    const widgetData = await atviseCustomRequest(
      event,
      'GET',
      `/customScripts/CtrlGetWidget?widget=${encodeURIComponent(body.widget)}`
    ) as AtviseWidgetResponse
    rawHtml = widgetData.html ?? widgetData.result ?? ''
    rawScript = widgetData.script ?? ''
    console.log('[widget-template] atviseCustomRequest result – htmlLen:', rawHtml.length, 'scriptLen:', rawScript.length)
  } else {
    console.error('[widget-template] Neither "widget" nor "html" provided in body')
    throw createError({ statusCode: 400, statusMessage: 'Either "widget" or "html" is required.' })
  }

  console.log('[widget-template] html preview (first 200 chars):', rawHtml.slice(0, 200))

  // Transform XML/SVG on the server (linkedom — no browser DOMParser needed)
  let template: string
  let parameters: WidgetParameter[]
  let embeddedScript = ''
  try {
    const result = processWidget(rawHtml, body.scaleToMax ?? true)
    template = result.template
    parameters = result.parameters
    embeddedScript = result.extractedScript
    console.log('[widget-template] processWidget OK – templateLen:', template.length, 'params:', parameters.length, 'embeddedScript:', embeddedScript.length)
    console.log('[widget-template] template preview (first 400 chars):', template.slice(0, 400))
  } catch (err) {
    console.error('[widget-template] processWidget FAILED:', err)
    throw err
  }

  // Use rawScript if provided (CtrlGetWidget path), else use script extracted from SVG
  const scriptSource = rawScript || embeddedScript
  const script = convertScript(scriptSource)
  console.log('[widget-template] convertScript OK – scriptLen:', script.length, '(source: ' + (rawScript ? 'rawScript' : 'extractedFromSVG') + ')')

  return { template, script, parameters }
})

// ---------------------------------------------------------------------------
// XML/SVG processing (runs in Node.js via linkedom)
// ---------------------------------------------------------------------------

function processWidget (html: string, scaleToMax: boolean): { template: string; parameters: WidgetParameter[]; extractedScript: string } {
  const { document } = parseHTML(html)

  const SVG = document.querySelector('svg')
  if (!SVG) {
    throw createError({ statusCode: 422, statusMessage: 'Widget contains no SVG element.' })
  }

  const svgWidth = SVG.getAttribute('width') ?? '100'
  const svgHeight = SVG.getAttribute('height') ?? '100'

  // Set responsive viewBox and style
  SVG.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
  SVG.setAttribute(
    'style',
    scaleToMax
      ? `height:100%;width:100%;max-width:${svgWidth}px;display:block;margin:auto;`
      : 'height:100%;width:100%;'
  )

  // Extract atv:parameter elements before any structural changes
  const parameters = extractParams(SVG, 'atv:parameter')

  // Extract and remove <script> tags.
  // When HTML came from CtrlGetWidget the script is already separate.
  // When HTML came from a direct webMI.data.read the script is still embedded.
  let extractedScript = ''
  SVG.querySelectorAll('script').forEach((n) => {
    let src = (n.textContent ?? '').replace('<![CDATA[', '').replace(']]>', '').trim()
    if (src) { extractedScript += src + '\n' }
    n.remove()
  })

  // Replace nested <svg xlink:href="..."> elements with <atvise-visu-v3> components
  SVG.querySelectorAll('svg').forEach((svg) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const transform = svg.getAttribute('transform')
    if (transform) { g.setAttribute('transform', transform) }
    g.setAttribute('id', svg.getAttribute('id') ?? '')
    g.setAttribute('height', svg.getAttribute('height') ?? '')
    g.setAttribute('width', svg.getAttribute('width') ?? '')

    const foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    foreign.setAttribute('x', svg.getAttribute('x') ?? '0')
    foreign.setAttribute('y', svg.getAttribute('y') ?? '0')
    foreign.setAttribute('height', svg.getAttribute('height') ?? '')
    foreign.setAttribute('width', svg.getAttribute('width') ?? '')
    g.appendChild(foreign)

    // Create the Vue component element for the nested display
    const atVisu = document.createElement('atvise-visu-v3')
    atVisu.setAttribute('settings', svg.getAttribute('xlink:href') ?? '')
    atVisu.setAttribute('args', JSON.stringify(extractParams(svg, 'atv:argument')))
    atVisu.setAttribute('overwrites', JSON.stringify(extractParams(svg, 'atv:overwrite')))
    atVisu.setAttribute('v-bind:base', 'base')
    foreign.appendChild(atVisu)

    svg.parentNode?.appendChild(g)
    svg.remove()
  })

  // Convert id="" attributes to ref="" so webMI.gfx.* can access elements via this.$refs
  SVG.querySelectorAll('[id]').forEach((node) => {
    node.setAttribute('ref', node.getAttribute('id') ?? '')
  })

  // --- Layout: split SVG and any embedded HTML foreignObject (#html) ---
  const div1 = document.createElement('div')
  div1.setAttribute('style', 'height:100%;width:100%')
  const div2 = document.createElement('div')
  div2.setAttribute('style', 'height:0%;width:100%')

  const htmlEl = SVG.querySelector('#html')
  console.log('[widget-template] #html foreignObject found:', !!htmlEl, htmlEl ? `(height=${htmlEl.getAttribute('height')})` : '')

  if (htmlEl) {
    const height1 = parseInt(svgHeight)
    let height2 = parseInt(htmlEl.getAttribute('height') ?? '0')

    const transform = htmlEl.getAttribute('transform')
    if (transform) {
      // matrix(1,0,0,scaleY,tx,ty) → extract scaleY from position [3]
      const parts = transform.split('(')[1]?.split(')')[0]?.split(',')
      if (parts && parts.length >= 4) {
        const scaleY = parseFloat(parts[3])
        height2 = Math.floor(height2 * scaleY)
      }
    }

    const div2HeightPct = (100 / height1) * height2
    console.log('[widget-template] layout – svgHeight:', height1, 'htmlHeight:', height2, 'div2Pct:', div2HeightPct)

    if (div2HeightPct === 100) {
      div1.setAttribute('style', 'height:0%;width:100%;display:none')
    } else {
      div1.setAttribute('style', `height:${100 - div2HeightPct}%;width:100%`)
    }
    div2.setAttribute('style', `height:${div2HeightPct}%;width:100%`)

    // Trim the SVG viewBox to exclude the HTML section
    SVG.setAttribute('viewBox', `0 0 ${svgWidth} ${height1 - height2}`)

    // Move the HTML content into div2
    const htmlContent = htmlEl.tagName.toLowerCase() === 'foreignobject'
      ? htmlEl.firstElementChild
      : htmlEl.querySelector('foreignObject')?.firstElementChild
    console.log('[widget-template] htmlContent tag:', htmlContent?.tagName, 'innerHTML preview:', htmlContent?.innerHTML?.slice(0, 200))
    if (htmlContent) {
      div2.appendChild(htmlContent)
    } else {
      console.warn('[widget-template] #html foreignObject has no firstElementChild – HTML content will be missing')
    }
  }

  div1.appendChild(SVG)

  const parent = document.createElement('div')
  parent.appendChild(div1)
  parent.appendChild(div2)

  // Serialize DOM → template string
  let template = parent.outerHTML

  // Replace Atvise theme colour sentinel values with Vue bindings
  template = template.replaceAll('stroke="#000001"', 'v-bind:stroke="darkColor"')
  template = template.replaceAll('fill="#000001"', 'v-bind:fill="darkColor"')
  template = template.replaceAll('stroke="#ffffe"', 'v-bind:stroke="lightColor"')
  template = template.replaceAll('fill="#fffffe"', 'v-bind:fill="lightColor"')

  return { template, parameters, extractedScript }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a raw Atvise widget script so it runs inside a Vue component:
 *   - `webMI.*`  → `self.webMI.*`  (or `this.webMI.*` when script returns options)
 *   - `document.getElementById('x')` → `self.$el.querySelector('#x')`
 *   - `document.`  → `self.$el.`
 */
function convertScript (script: string): string {
  if (script.substring(0, 10).includes('return')) {
    // Script returns Vue component options — uses `this` context
    script = script.replaceAll(' webMI.', ' this.webMI.')
  } else {
    // Script runs as a mounted hook — uses `self` alias for the component
    script = script.replace(/(?<!\.)webMI\./g, 'self.webMI.')
  }
  script = script.replaceAll("document.getElementById('", "self.$el.querySelector('#")
  script = script.replaceAll('document.getElementById("', 'self.$el.querySelector("#')
  script = script.replaceAll('document.', 'self.$el.')
  return script
}

/**
 * Extract all child elements of a given tag type from an SVG/element and
 * return their attributes as plain objects.
 */
function extractParams (el: Element, tagName: string): WidgetParameter[] {
  const params: WidgetParameter[] = []
  const elements = el.getElementsByTagName(tagName)
  for (let i = 0; i < elements.length; i++) {
    const param: WidgetParameter = { name: '' }
    const attrs = elements[i].attributes
    for (let j = 0; j < attrs.length; j++) {
      param[attrs[j].name] = attrs[j].value
    }
    params.push(param)
  }
  return params
}
