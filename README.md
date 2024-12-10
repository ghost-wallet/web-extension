<p align="center">
  <img src="/assets/ghost-outline-512.png" alt="Ghost Wallet Logo" width="150">
</p>

# Ghost Wallet

First open source Chrome web extension wallet for Kaspa & KRC20 tokens. Swap, mint, send, and receive KRC20 tokens directly in the wallet. You keep full custody of your private keys, which never leave your web browser. Ghost wallet web extension repo is forked from [Kaspian](https://github.com/KaffinPX/Kaspian).

[![UV4C4ybeBTsZt43U4xis](https://github.com/user-attachments/assets/7832f254-747c-4e57-92bb-8028ae66ed2f)](https://chromewebstore.google.com/detail/ghost-wallet/npeepgefdbcmlapenpeephmidkobghna)

---

## Socials

Discord is the easiest way to reach out to the Ghost Wallet team for dev support and collaboration opportunities.

| Platform                                                                                                     |
|-------------------------------------------------------------------------------------------------------------|
| [![X](https://img.shields.io/badge/X-%23000000.svg?style=for-the-badge&logo=x&logoColor=white)](https://x.com/ghostwallet_) |
| [![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ghost-wallet) |
| [![Discord](https://img.shields.io/badge/Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/ghostwallet) |

## API

Ghost Wallet provides a Mint API for minting KRC20 tokens from any wallet. Make a POST request to our [mint request endpoint](https://api.ghostwallet.org/api#/KRC-20/MintController_mintRequest_v1), copy the response `address`, then transfer the desired amount of mints in KAS directly to that address.  A 10% network fee is automatically collected on every mint. See the full documentation on [Swagger](https://api.ghostwallet.org/api#)

# Features

## Wallet
Ghost wallet supports all KRC20 tokens for holding, sending, and receiving.

<img src="/assets/readme/wallet.png" alt="Ghost Wallet Screenshot" width="365">

## Swap
Ghost wallet is integrated with Chainge for KRC20 token trading. Only KRC20 tokens listed on Chainge's DEX are tradeable. Learn more at [Chainge finance](https://krc20.chainge.finance/).

<img src="/assets/readme/chainge-swap.png" alt="Ghost Wallet Screenshot" width="365">

## Mint
Mint any KRC20 tokens in Ghost wallet. You can submit as many mints as you want, which will all be run in parallel. It is safe to close your browser or shut down your computer while mints are ongoing. Minted tokens will be airdropped into your wallet automatically. If the minted supply for a token hits 100% while you are minting, excess funds will be refunded to your wallet in KAS automatically. There is a 10% network fee applied to every mint.

<img src="/assets/readme/mint.png" alt="Ghost Wallet Screenshot" width="365">

# Development
## 1. Clone repository

## 2. Install Bun

Install Bun from [NPM](https://www.npmjs.com/package/bun)

```
bun install
```

## 3. Build dist folder

Build the Chrome extension into a dist folder

```
bunx --bun vite build --minify false
```

## 4. Deploy Chrome extension

1. Go to [chrome://extensions/](chrome://extensions/)
2. Enable developer mode by clicking the toggle in the top right corner
3. Click "Load unpacked"
4. Navigate to your project's root folder and select the `dist` folder


