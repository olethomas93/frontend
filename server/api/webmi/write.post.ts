/**
 * POST /api/webmi/write
 *
 * Body: { nodes: Array<{ address: string; value: unknown; type?: string }> }
 *
 * Proxies a webMI data write to the Atvise server.
 * Replaces direct `top.webMI.data.write(nodes, values, callback)` calls.
 */
import { defineEventHandler, readBody, createError } from 'h3'
import { atviseWrite, type AtviseNode } from '~/server/utils/atvise'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ nodes: AtviseNode | AtviseNode[] }>(event)

  const nodes: AtviseNode[] = Array.isArray(body.nodes) ? body.nodes : [body.nodes]

  if (!nodes.every(n => n.address)) {
    throw createError({ statusCode: 400, statusMessage: 'Each node must have an "address" field.' })
  }

  return atviseWrite(event, nodes)
})
