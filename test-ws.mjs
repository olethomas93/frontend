import { WebSocket } from 'ws'
const target = process.env.ATVISE_PROXY
if (!target) {
  console.error('ATVISE_PROXY not set in env when running node test-ws.mjs')
  process.exit(1)
}
const url = target.replace(/^http/, 'ws') + '/webMI/?'
console.log('Connecting to', url)
const ws = new WebSocket(url)
ws.on('open', () => {
  console.log('WebSocket open -> closing')
  ws.close()
})
ws.on('error', (err) => {
  console.error('WebSocket error:', err.message)
})
