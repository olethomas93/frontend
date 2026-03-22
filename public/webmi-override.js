// Development-only: tune webMI settings so the Vite dev-proxy is not
// crashed by WebSocket upgrade resets, and ?publish long-poll spam is reduced.
// In production the WebSocket runs through a real reverse-proxy (nginx) which
// handles it correctly, so this file is only served in development.
;(function () {
  var cfg = window.webMIConfig
  if (!cfg || typeof cfg !== 'object') {
    window.webMIConfig = cfg = {}
  }
  // Disable WebSocket — Atvise resets the WS upgrade through Vite's proxy,
  // causing an unhandled ECONNRESET that crashes the dev server.
  cfg['data.websocket'] = false
  // Increase the XHR long-poll interval to 2 s to avoid flooding the proxy
  // with rapid-fire ?publish requests (default is 250 ms in XHR-only mode).
  cfg['data.publishinterval'] = 2000
})()
