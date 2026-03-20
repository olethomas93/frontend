/**
 * POST /api/webmi/read
 *
 * Body: { nodes: string[] }
 *
 * Proxies a webMI data read to the Atvise server and returns the result.
 * Replaces direct `top.webMI.data.read(nodes, callback)` calls in the browser.
 */
import { defineEventHandler, readBody } from 'h3'
import { atviseRead } from '~/server/utils/atvise'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ nodes: string | string[] }>(event)

  const nodes: string[] = Array.isArray(body.nodes) ? body.nodes : [body.nodes]

  return atviseRead(event, nodes)
})
