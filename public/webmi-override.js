// Development-only: disable webMI WebSocket so the Vite dev-proxy is not
// crashed by the Atvise server resetting the WebSocket upgrade.
// In production the WebSocket runs through a real reverse-proxy (nginx) which
// handles it correctly, so this file is only served in development.
;(function () {
  if (window.webMIConfig && typeof window.webMIConfig === 'object') {
    window.webMIConfig['data.websocket'] = false
  } else {
    window.webMIConfig = { 'data.websocket': false }
  }
})()
