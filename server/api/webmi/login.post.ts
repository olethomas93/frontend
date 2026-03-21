/**
 * POST /api/webmi/login
 *
 * Body: { username: string; password: string }
 *
 * Authenticates with the Atvise webMI server from the server side.
 *
 * Atvise with securitysupport:true requires the password to be RSA PKCS1 v1.5
 * encrypted with the server's public key before submission — identical to what
 * webmi.js does via its internal Ub() / kc() functions.  The encrypted value
 * is sent as the "passwordcipher" field (NOT "password") to /webMI/?login.
 *
 * webMI calls are routed through the Nitro devProxy (loopback via the incoming
 * request's Host header) so that the same proxy path used by browser requests
 * is reused — direct calls to ATVISE_PROXY would bypass any path rewriting
 * the proxy applies and return 404.
 *
 * On success forwards any Set-Cookie headers so the browser session is
 * established for subsequent REST calls.
 */
import { defineEventHandler, readBody, createError, setResponseHeaders } from 'h3'
import { createPublicKey, publicEncrypt, constants } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  const { username, password } = body ?? {}

  if (!username || password === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'username and password are required' })
  }

  // Route through the Nitro devProxy by calling the local server's /webMI/ paths.
  // The incoming Host header (e.g. localhost:8655) resolves to the same Nitro instance
  // that already correctly proxies /webMI/... to the Atvise server.
  const reqHost = event.node.req.headers['x-forwarded-host'] ?? event.node.req.headers.host ?? `localhost:${process.env.PORT || 8656}`
  const protocol = (event.node.req.headers['x-forwarded-proto'] as string | undefined) ?? 'http'
  const webmiBase = `${protocol}://${reqHost}`

  // Step 1: Fetch server info to obtain the RSA public key
  const info = await $fetch<{
    encryptionexponent?: string
    encryptionmodulus?: string
    securitysupport?: boolean
  }>(`${webmiBase}/webMI/?info`).catch((err: any) => {
    throw createError({ statusCode: 502, statusMessage: `Failed to reach Atvise server: ${err?.message ?? err}` })
  })

  // Step 2: Build form body — webmi.js sends "passwordcipher" (RSA-encrypted) when
  // securitysupport is true, matching the Ub()/kc() logic in webmi.js:
  //   passwordcipher = hex( RSA_PKCS1v1.5_encrypt( pubkey, utf8(password) ) )
  const formParams: Record<string, string> = { username }

  if (info.securitysupport && info.encryptionmodulus && info.encryptionexponent) {
    try {
      const modulus = Buffer.from(info.encryptionmodulus, 'hex')
      const exponent = Buffer.from(info.encryptionexponent, 'hex')
      const pubKey = createPublicKey({
        key: {
          kty: 'RSA',
          n: modulus.toString('base64url'),
          e: exponent.toString('base64url')
        },
        format: 'jwk'
      })
      const plaintext = Buffer.from(password, 'utf8')
      const ciphertext = publicEncrypt({ key: pubKey, padding: constants.RSA_PKCS1_PADDING }, plaintext)
      formParams.passwordcipher = ciphertext.toString('hex')
    } catch (err: any) {
      throw createError({ statusCode: 500, statusMessage: `RSA encryption failed: ${err?.message ?? err}` })
    }
  } else {
    // Server does not require encryption — send plain text (legacy / test servers)
    formParams.password = password
  }

  const loginUrl = `${webmiBase}/webMI/?login`
  const formBody = new URLSearchParams(formParams).toString()

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
