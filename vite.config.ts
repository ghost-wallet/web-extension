import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { crx, ManifestV3Export } from '@crxjs/vite-plugin'
import * as path from 'path'

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'Ghost Wallet',
  version: '0.0.7',
  icons: {
    48: 'assets/ghost-outline-thick-48.png',
    128: 'assets/ghost-outline-128.png',
    512: 'assets/ghost-outline-512.png',
  },
  action: {
    default_popup: 'index.html',
  },
  side_panel: {
    default_path: 'index.html',
  },
  background: {
    service_worker: 'src/wallet/walletServiceWorker.ts',
    type: 'module',
  },
  permissions: [
    'storage', 
    //'alarms', 
    'notifications', 
    'sidePanel'
  ],
  // browser_specific_settings: {
  //   gecko: {
  //     id: 'ghostappwallet@gmail.com',
  //   },
  // },
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
  },
  host_permissions: [
    'https://*.kaspa.stream/*',
    'https://storage.googleapis.com/kspr-api-v1/*',
    'https://api.coingecko.com/*',
    'https://*.kas.fyi/*',
    'https://api.kaspa.org/*',
    'https://*.kasplex.org/*',
    'https://api.ghostwallet.org/*',
    'https://*.kaspa.blue/*',
    'https://*.chainge.finance/*'
  ],
}

// Pass the version as a global variable
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  define: {
    __APP_VERSION__: JSON.stringify((manifest as any).version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    strictPort: true,
    hmr: {
      clientPort: 3000,
    },
    port: 3000,
  },
  build: {
    minify: false,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'axios': ['axios'],
        },
      }
    }
  }
})
