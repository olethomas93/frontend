import express from 'express'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import config from '../nuxt.config.js'
// Init
const app = express()
config.dev = process.env.NODE_ENV !== 'production'

// Basic hardening and observability endpoints without new dependencies
app.disable('x-powered-by')
app.use((req, res, next) => {
  // Lightweight headers to reduce common risks while keeping compatibility with atvise assets
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'same-origin')
  res.setHeader('Permissions-Policy', 'geolocation=()')
  next()
})

// Liveness/readiness probes for container orchestration and uptime checks
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})
app.get('/readyz', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})
// Define
async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev || process.env.RUN_AS === 'docker') {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server is listening on http://${host}:${port}`,
    badge: true
  })
}
start()
