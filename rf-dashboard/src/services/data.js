export function getHostname() {
  return window.location.hostname === 'localhost' ? 'http://' : 'https://'
}

export function getSocketProtocol() {
  return window.location.hostname === 'localhost' ? 'ws://' : 'wss://'
}
