/**
 * POST /api/webmi/custom-request
 *
 * Body: { method: 'GET' | 'POST'; path: string; body?: unknown }
 *
 * Proxies arbitrary requests to Atvise custom script endpoints
 * (e.g. /customScripts/CtrlGetWidget).
 * Replaces `top.webMI.data.customRequest(method, path, callback)`.
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { atviseCustomRequest } from '~/server/utils/atvise'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ method: 'GET' | 'POST'; path: string; body?: unknown }>(event)

  if (!body.path) {
    throw createError({ statusCode: 400, statusMessage: '"path" is required.' })
  }

  const method = body.method === 'POST' ? 'POST' : 'GET'
  return atviseCustomRequest(event, method, body.path, body.body)
})
