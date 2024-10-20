import { KaswareProvider } from "./kasware-emulator";

declare global {
    interface Window {
      kasware: KaswareProvider;
    }
  }
  
  const provider = new KaswareProvider();
  
  console.log('trying to init kasware emulator')
  if (!window.kasware) {
    window.kasware = new Proxy(provider, {
      deleteProperty: () => true
    });
  }
  
  Object.defineProperty(window, 'kasware', {
    value: new Proxy(provider, {
      deleteProperty: () => true
    }),
    writable: false
  });
  
  window.dispatchEvent(new Event('kasware#initialized'));