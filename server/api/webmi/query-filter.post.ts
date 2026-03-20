/**
 * POST /api/webmi/query-filter
 *
 * Body: { filter: Record<string, unknown> }
 *
 * Executes a webMI queryFilter on Atvise (used for alarms and advanced data
 * queries).  Replaces `top.webMI.data.queryFilter(filter, callback)`.
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { atviseQueryFilter } from '~/server/utils/atvise'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ filter: Record<string, unknown> }>(event)

  if (!body.filter) {
    throw createError({ statusCode: 400, statusMessage: '"filter" is required.' })
  }

  return atviseQueryFilter(event, body.filter)
})
