/**
 * POST /api/webmi/call
 *
 * Body: { func: string; args?: Record<string, unknown> }
 *
 * Calls a server-side Atvise function.
 * Replaces direct `top.webMI.data.call(func, args, callback)` calls.
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { atviseCall } from '~/server/utils/atvise'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ func: string; args?: Record<string, unknown> }>(event)

  if (!body.func) {
    throw createError({ statusCode: 400, statusMessage: '"func" is required.' })
  }

  return atviseCall(event, body.func, body.args ?? {})
})
