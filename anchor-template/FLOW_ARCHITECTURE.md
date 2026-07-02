# NordStern Anchor: End-to-End Flow Architecture

This document explains exactly how money moves through the NordStern Anchor system during SEP-24 On-Ramps (Deposits) and Off-Ramps (Withdrawals), and how the system translates to Mainnet production.

---

## 1. On-Ramp Flow (Fiat Deposit → USDC)

An on-ramp occurs when a user wants to trade their fiat (INR) for crypto (USDC).

### Step-by-Step Execution:
1. **Initiation:** The user opens a Stellar wallet (e.g., Vibrant, Lobstr) and requests to deposit USDC via your Anchor.
2. **Authentication:** The wallet authenticates with your `anchor-platform` (SEP-10).
3. **Interactive UI:** The wallet opens a webview to your `business-server`.
4. **Fiat Collection:** The `business-server` quotes a live FX rate and displays a UPI QR code or payment gateway link (e.g., Razorpay/Cashfree).
5. **Payment Confirmation:** The user pays via UPI. Razorpay sends a webhook to the `business-server` confirming the INR has arrived in your bank account.
6. **Crypto Disbursement:** The `business-server` automatically signs a Stellar transaction transferring the equivalent USDC from your **Anchor Treasury** to the user's Stellar wallet.
7. **Completion:** The transaction is marked `completed` in the Anchor Platform database, and the user sees the USDC in their wallet.

---

## 2. Off-Ramp Flow (USDC Withdrawal → Fiat)

An off-ramp occurs when a user wants to cash out their crypto (USDC) into their local bank account (INR).

### Step-by-Step Execution:
1. **Initiation:** The user requests a withdrawal in their Stellar wallet.
2. **Interactive UI:** The wallet opens the `business-server` webview, which asks the user for their bank account details (or pulls them from their KYC profile).
3. **Crypto Collection:** The `business-server` generates a unique text Memo and tells the user to send their USDC to your **Anchor Treasury** address using that Memo.
4. **On-Chain Detection:** The user's wallet executes the Stellar transaction. The Anchor Platform's **Observer** (a background process) constantly scans the Stellar blockchain. It sees the incoming USDC, matches the Memo to the specific user's transaction, and marks the funds as received.
5. **Fiat Disbursement:** A poller in your `business-server` sees the funds have arrived. It automatically triggers a payout API (e.g., Cashfree Payouts / RazorpayX) to wire INR directly to the user's bank account.
6. **Completion:** Once the bank confirms the transfer, the transaction is marked `completed`.

---

## 3. How Mainnet Works: The Dual-Treasury System

When you move to Mainnet (Production), your anchor is dealing with real money. You do **not** mint new USDC out of thin air. Instead, you operate as an exchange holding two pools of liquidity:

### A. The Fiat Treasury (Bank Account)
This is a corporate bank account (often a Nodal or Escrow account) integrated with Razorpay, Cashfree, or your banking partner.
* It fills up when users do On-Ramps (Deposits).
* It drains when you pay out users doing Off-Ramps (Withdrawals).

### B. The Crypto Treasury (Stellar Account)
This is a secure Stellar wallet controlled by your `business-server`. It must be pre-funded with real, 1:1 backed Circle USDC.
* It drains when users do On-Ramps (you send them USDC).
* It fills up when users do Off-Ramps (they send you USDC).

### Liquidity Rebalancing
Because you are facilitating trades, one of your treasuries will eventually run low depending on market demand. 
* If everyone is buying USDC (On-Ramping), your Fiat Treasury will get huge, but your Crypto Treasury will run out of USDC.
* **The Solution:** As the anchor operator, you periodically take the excess INR from your bank account, send it to a wholesale exchange or directly to Circle, buy more USDC in bulk, and refill your Crypto Treasury. 

### How You Make Money
You make money on the **spread** and the **fees**. 
For example, you might sell USDC to users for ₹85.00, but buy it back from them during withdrawals for ₹83.00. This margin covers the cost of your capital sitting in the treasuries and generates your profit.
