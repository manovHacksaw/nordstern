# Known Issues & Technical Debt

> **Context:** This document tracks bugs, architectural limitations, and temporary hacks that must be addressed before this anchor can be considered production-ready.

---

## 🏗️ Technical Debt

- **Lack of Transaction Idempotency:** Right now, in `sep24.ts`, we call `sendUsdc()` to release funds on the Stellar network, and *then* we call `patchTransaction()` to update the AP database to `completed`. 
  - *Risk:* If the Node process crashes or the database goes down immediately after the Stellar transaction succeeds, the AP database will never know the money was sent. The transaction gets stuck, and a naive operator might try to process it again, resulting in a **double-spend**.
  - *Fix Required:* Implement a "Transfer-After-Commit" (Outbox) pattern. We must record the intent to send in our own database table *first*, and safely reconcile it.

- **Mock Providers:** The `KycProvider` defaults to `MockKycProvider` (which approves everyone). The `DepositProvider` only generates a QR code but doesn't actually listen for real bank receipts. 

## 🚧 Limitations

- **Single Tenant Only:** The `anchor-template` is currently hardcoded for a single anchor operator. The `stellar.toml` is static, the database is unified, and the secrets are global. Moving to the SaaS Control Plane requires rewriting these to be tenant-aware.
- **No Client Authentication:** The Next.js dashboard (`client/`) running on port `3001` is wide open. Anyone on the network can view the treasury and transaction data. This needs NextAuth / JWT integration.
