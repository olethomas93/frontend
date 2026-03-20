/**
 * Server-side Atvise HTTP client utility.
 *
 * The Atvise webMI HTTP API is proxied here so the frontend no longer needs
 * to be embedded inside an Atvise iframe or load webmi.js from the Atvise
 * server.  All data operations (read / write / call / queryFilter) go through
 * these server routes, keeping credentials and session cookies server-side.
 */

import { H3Event, getHeader, createError } from 'h3'

// ---------------------------------------------------------------------------
// Types matching the webMI callback payloads
// ---------------------------------------------------------------------------

export interface AtviseNode {
  address: string
  value?: unknown
  type?: string
}

export interface AtviseReadResult {
  address: string
  value: unknown
  quality: number
  timestamp?: string
  error?: number
  errorstring?: string
}

export interface AtviseWriteResult {
  error: number
  errorstring?: string
}

export interface AtviseCallResult {
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getAtviseBaseUrl (): string {
  const config = useRuntimeConfig()
  const url = (config as any).atviseProxy as string | undefined
  if (!url) {
    throw createError({ statusCode: 503, statusMessage: 'ATVISE_PROXY is not configured on the server.' })
  }
  return url.replace(/\/$/, '')
}

/**
 * Build a headers object that forwards the client's cookies so Atvise can
 * resolve the existing webMI session (set up during the initial page load or
 * login).
 */
function forwardHeaders (event: H3Event): Record<string, string> {
  const cookie = getHeader(event, 'cookie') ?? ''
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookie) {
    headers.cookie = cookie
  }
  return headers
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Read one or more OPC-UA nodes from Atvise.
 *
 * Atvise webMI HTTP API: POST /webMI/data/get
 * Body: Array of address strings  →  [ "ns=1;s=AGENT.OBJECTS.foo", … ]
 */
export async function atviseRead (
  event: H3Event,
  nodes: string[]
): Promise<AtviseReadResult[]> {
  const base = getAtviseBaseUrl()
  return $fetch<AtviseReadResult[]>(`${base}/webMI/data/get`, {
    method: 'POST',
    headers: forwardHeaders(event),
    body: nodes.map(a => ({ address: a }))
  })
}

/**
 * Write one or more OPC-UA nodes to Atvise.
 *
 * Atvise webMI HTTP API: POST /webMI/data/set
 * Body: Array of { address, value, type }
 */
export async function atviseWrite (
  event: H3Event,
  nodes: AtviseNode[]
): Promise<AtviseWriteResult[]> {
  const base = getAtviseBaseUrl()
  return $fetch<AtviseWriteResult[]>(`${base}/webMI/data/set`, {
    method: 'POST',
    headers: forwardHeaders(event),
    body: nodes
  })
}

/**
 * Call a server-side function on Atvise.
 *
 * Atvise webMI HTTP API: POST /webMI/data/call
 * Body: { address, arguments }
 */
export async function atviseCall (
  event: H3Event,
  func: string,
  args: Record<string, unknown>
): Promise<AtviseCallResult> {
  const base = getAtviseBaseUrl()
  return $fetch<AtviseCallResult>(`${base}/webMI/data/call`, {
    method: 'POST',
    headers: forwardHeaders(event),
    body: { address: func, arguments: args }
  })
}

/**
 * Execute a queryFilter on Atvise (used for alarm subscriptions and advanced
 * queries).
 *
 * Atvise webMI HTTP API: POST /webMI/data/queryFilter
 */
export async function atviseQueryFilter (
  event: H3Event,
  filter: Record<string, unknown>
): Promise<unknown> {
  const base = getAtviseBaseUrl()
  return $fetch(`${base}/webMI/data/queryFilter`, {
    method: 'POST',
    headers: forwardHeaders(event),
    body: filter
  })
}

/**
 * Make an arbitrary GET or POST request to an Atvise custom script endpoint,
 * e.g. /customScripts/CtrlGetWidget.
 */
export async function atviseCustomRequest (
  event: H3Event,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown
): Promise<unknown> {
  const base = getAtviseBaseUrl()
  return $fetch(`${base}${path}`, {
    method,
    headers: forwardHeaders(event),
    ...(body !== undefined ? { body } : {})
  })
}
