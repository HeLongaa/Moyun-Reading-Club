let ws = null
let reconnectTimer = null
let listeners = {}

function connect(token) {
  if (ws) ws.close()
  ws = new WebSocket(`${process.env.VUE_APP_WS_URL || 'ws://localhost:5001/ws'}?token=${token}`)
  ws.onopen = () => listeners.open && listeners.open()
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (listeners.message) listeners.message(data)
  }
  ws.onclose = () => {
    listeners.close && listeners.close()
    reconnectTimer = setTimeout(() => connect(token), 3000)
  }
  ws.onerror = () => ws.close()
}

function on(event, cb) { listeners[event] = cb }
function off(event) { delete listeners[event] }
function send(data) { ws && ws.readyState === 1 && ws.send(JSON.stringify(data)) }
function close() { ws && ws.close() }

export default { connect, on, off, send, close }
