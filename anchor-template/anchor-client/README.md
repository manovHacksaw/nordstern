# Customer App

The **white-label end-customer experience** for a single anchor. One branded instance runs per provisioned anchor.

## What it is

A Next.js (App Router) app (`stellar-anchor-client`, image `nordstern/anchor-client:dev`) served at **`<slug>.nordstern.live`** (locally `http://<slug>.anchors.127.0.0.1.sslip.io`). It gives an end user:

- OTP login and KYC/verify (DIDIT).
- **Buy** (fiat → token) and **Sell** (token → fiat) via SEP-24.
- Transaction history, receipts, and a profile with attached Stellar wallets.

The blockchain is hidden: customers sign SEP-10 auth with their **own** wallet and hold tokens themselves — NordStern never takes custody.

## Why it exists

Wallets open an anchor's SEP-24 interactive flow in a webview; this app *is* that flow, branded per anchor. Because it is one image serving N tenants, branding is injected at container launch.

## Run it independently

```bash
cd anchor-template/anchor-client
npm install --legacy-peer-deps
npm run dev            # next dev -p 3001
```

Standalone it renders the UI; the full buy/sell flow needs a live business-server + Anchor Platform for that anchor (provisioned by the control-plane).

## Required environment

Branding + the anchor's SEP endpoints are injected per anchor at launch. Path alias is workspace-local (`@/* → ./*`).

## Commands

`npm run dev` (`:3001`) · `npm run build` · `npm start -p 3001` · `npm run lint`.

## Dependencies & interactions

Next.js · React 19 · `@stellar/freighter-api`. Talks to its anchor's **business-server** (SEP-24 webview + status) and **Platform API** (customer identity/OTP). Cloned per anchor by the **control-plane**.
