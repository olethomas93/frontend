/**
 * POST /api/webmi/login
 *
 * Body: { username: string; password: string }
 *
 * Authenticates with the Atvise webMI server from the server side.
 * Server-to-server calls use different HTTP headers than browser XHR,
 * so the Atvise server returns JSON instead of the SPA HTML fallback.
 *
 * On success forwards any Set-Cookie headers so the browser session is
 * established for subsequent REST calls.
 */
import { defineEventHandler, readBody, createError, setResponseHeaders } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  const { username, password } = body ?? {}

  if (!username || password === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'username and password are required' })
  }

  const config = useRuntimeConfig()
  const base = (config as any).atviseProxy as string | undefined

  if (!base) {
    throw createError({ statusCode: 503, statusMessage: 'ATVISE_PROXY is not configured on the server.' })
  }

  const loginUrl = `${base.replace(/\/$/, '')}/webMI/?login`

  // Use node-fetch / ofetch with form-encoded body — the same format webmi.js uses,
  // but from the Node process so the Atvise server sees a non-browser User-Agent
  // and (on most Atvise deployments) returns JSON instead of the SPA HTML fallback.
  const formBody = new URLSearchParams({ username, password }).toString()

  const response = await $fetch.raw(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: formBody,
    redirect: 'manual'    // don't follow redirects — a redirect means the HTML fallback
  }).catch((err: any) => {
    throw createError({ statusCode: 502, statusMessage: `Atvise login request failed: ${err?.message ?? err}` })
  })

  // Forward session cookies so the browser inherits the webMI session
  const setCookie = response.headers.getSetCookie?.() ?? []
  if (setCookie.length) {
    setResponseHeaders(event, { 'set-cookie': setCookie })
  }

  const data = response._data as any

  // Atvise login response: { "": { username, role, ... } } on success,
  //                        { "": { error, errorstring } } on failure
  const result = data?.[''] ?? data

  if (result?.error && result.error !== 0) {
    throw createError({
      statusCode: 401,
      statusMessage: result.errorstring ?? 'Login failed'
    })
  }

  return {
    username: result?.username ?? username,
    role: result?.role,
    additionalInfo: result?.additionalInfo
  }
})
