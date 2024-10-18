# Ghost Wallet - Browser Extension for Kaspa & KRC20 Tokens

## What is Ghost Wallet?

Ghost is a browser extension wallet designed for Kaspa and KRC20 tokens. With Ghost,
you can hold, send, receive, and trade KRC20 tokens. Ghost wallet is a Chrome-based browser extension.

## The Wallet

![Ghost Wallet Screenshot](/assets/GhostToS.png)
![Ghost Wallet Screenshot 2](/assets/GhostWallet.png)

## Development

## Installation

Install Bun from [NPM](https://www.npmjs.com/package/bun)

```
bun install
```

## Building

Build the Chrome extension into a dist folder

```
bunx --bun vite build --minify false
```

## Deploying

1. Go to chrome://extensions/
2. Enable developer mode by clicking the toggle in the top right corner
3. Click on "Load unpacked"
4. Navigate to your project's root folder and select the `dist` folder


