import browser from 'webextension-polyfill'
import { isRequest, type ProviderInfo } from './protocol'

function announceProvider() {
  const info: ProviderInfo = {
    id: browser.runtime.id,
    name: 'Kaspian',
  }

  window.dispatchEvent(
    new CustomEvent('wasm:provider', {
      detail: Object.freeze(info),
    }),
  )
}

window.addEventListener('wasm:requestProviders', () => {
  announceProvider()
})

window.addEventListener('wasm:connect', (event) => {
  const extensionId = (event as CustomEvent<string>).detail
  if (browser.runtime.id !== extensionId) return

  const port = browser.runtime.connect({
    name: '@kaspian/provider',
  })

  port.onMessage.addListener((message) => {
    window.dispatchEvent(
      new CustomEvent('wasm:event', {
        detail: Object.freeze(message),
      }),
    )
  })

  const invokeListener = (event: Event) => {
    const request = (event as CustomEvent).detail
    if (!isRequest(request)) return

    port.postMessage(request)
  }

  window.addEventListener('wasm:invoke', invokeListener)
  window.addEventListener('wasm:disconnect', () => port.disconnect(), {
    once: true,
  })

  port.onDisconnect.addListener(() => {
    window.removeEventListener('wasm:invoke', invokeListener)
    window.dispatchEvent(new CustomEvent('wasm:disconnect'))
  })
})

announceProvider()
