import browser from 'webextension-polyfill'
import { isRequest, type ProviderInfo } from './protocol'

// @ts-ignore
import pageScript from './page-script?script&module'

function announceProvider() {
  const info: ProviderInfo = {
    id: browser.runtime.id,
    name: 'Ghost',
  }

  window.dispatchEvent(
    new CustomEvent('kaspa:provider', {
      detail: Object.freeze(info),
    }),
  )
}

window.addEventListener('kaspa:requestProviders', () => {
  announceProvider()
})

window.addEventListener('kaspa:connect', (event) => {
  const extensionId = (event as CustomEvent<string>).detail
  if (browser.runtime.id !== extensionId) return

  const port = browser.runtime.connect({
    name: '@ghost/provider',
  })

  port.onMessage.addListener((message) => {
    window.dispatchEvent(
      new CustomEvent('kaspa:event', {
        detail: Object.freeze(message),
      }),
    )
  })

  const invokeListener = (event: Event) => {
    const request = (event as CustomEvent).detail
    if (!isRequest(request)) return

    port.postMessage(request)
  }

  window.addEventListener('kaspa:invoke', invokeListener)
  window.addEventListener('kaspa:disconnect', () => port.disconnect(), {
    once: true,
  })

  port.onDisconnect.addListener(() => {
    window.removeEventListener('kaspa:invoke', invokeListener)
    window.dispatchEvent(new CustomEvent('kaspa:disconnect'))
  })
})

announceProvider()


function injectScript(path: string) {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    //scriptTag.setAttribute('channel', channelName);
    scriptTag.src = browser.runtime.getURL(path);
    scriptTag.type = 'module'
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
  } catch (error) {
    console.error('Provider injection failed.', error);
  }
}

injectScript(pageScript)