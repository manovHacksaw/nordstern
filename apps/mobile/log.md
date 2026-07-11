# nordpay — Work log

Chronological record of what was built for the Stellar Anchor Wallet recreation.
Newest at the bottom. Decisions with rationale live in [decisions.md](decisions.md);
the task plan is `docs/superpowers/plans/2026-07-06-stellar-anchor-wallet.md`.

Verification model (per the plan): this is a UI recreation, so "verify" =
`npx tsc --noEmit` clean + boot in Expo + drive the flow by hand. No unit-test suite.

---

## Phase A — vertical slice (build, then PAUSE for review)

### Task 1 — Foundation (deps, fonts, theme) ✅
- Installed via `npx expo install`: react-native-svg, react-native-qrcode-svg,
  expo-linear-gradient, @expo-google-fonts/inter, @expo-google-fonts/jetbrains-mono.
  `zustand` via bun add.
- `constants/tokens.ts` — dark + light `ColorTokens`, radius, space (4px), shadows, motion.
- `theme/fonts.ts` — `Font` role map + `useAppFonts()` (7 families).
- `theme/theme-context.tsx` — `ThemeProvider` (default dark) + `useTheme()`.
- `app/_layout.tsx` — font gate + splash, ThemeProvider, StatusBar.
- Verify: `tsc --noEmit` clean.

### Task 2 — UI primitives ✅
- `components/ui/icon.tsx` — `ICONS` map (verbatim SVG paths) + `Icon`, `IconName`.
- `components/ui/text.tsx` — `AppText` variants (display/h1/h3/title/body/mono/…).
- `components/ui/badge.tsx` — `Badge` + `Tone` (success/info/warning/error/brand/neutral).
- `components/ui/button.tsx` — `PrimaryButton`, `SecondaryButton`, `CircleButton`.
- `components/ui/card.tsx` — `Card` + `Row`.
- `components/ui/screen.tsx` — `Screen` + `FlowHeader`.
- Verify: `tsc --noEmit` clean.

### Task 3 — Data seam + formatting ✅
- `lib/format.ts` — `fmt`/`parse`/`money` (mirror prototype).
- `lib/assets.ts` — `PRICES`, `META`, `ORDER`, `FIAT`, `fiatFor`, `AssetSym`.
- `lib/anchors.ts` — `ANCHORS` (6, verbatim), `METHODS` (8), `METHOD_ICON`,
  `anchorById`, `issuerAnchor`.
- `lib/activity.ts` — `ACTIVITY` (7 rows), `STATUS_TONE`, `TYPE_ICON`.
- `lib/quotes.ts` — `depositQuote`/`withdrawQuote`/`crossborderQuote` (pure, mirror
  `depData`/`wdData`/`cbData` math; fee = amount × feeNum; cross-border 1% + ₦1650).
- Verify: `tsc --noEmit` clean.

### Routing warning fix ✅ (out-of-band, user-requested)
- Root cause: `app/_layout.tsx` declared `<Stack.Screen>` for route files that
  don't exist yet → `No route named "deposit"/"withdraw"/… exists in nested
  children` on every reload.
- Fix: childless `<Stack>` with shared `screenOptions`; routes auto-register from
  the filesystem. See D-003.

### Task 4 — Zustand store ✅
- `lib/assets.ts` — added `Balances` type + `totalUsd()`.
- `store/wallet-store.ts` — `useWallet` create() with full state (verbatim initial
  values) + actions: derived (`total`/`anchor`/`isConnected`/`needKyc`), setters
  (`setField`/`setMethod`/`setMax`), flow entry (`startDeposit`/`startWithdraw`/
  `startCrossborder`), flow control (`proceed`/`prevStep`/`requestReview`/`runTx`),
  kyc (`startKyc`/`kycNext`/`kycBack`/`finishKyc`/`consumeKycDone`), misc
  (`toggleConnect`/`toggleHide`/`toggleFace`/`toggleNotif`/`flash`/`reset`).
- Two deliberate deviations from the prototype, both advisor-confirmed:
  D-005 (deposit bumps by quoted `getN`) and D-006 (KYC gate never pre-advances step).
- Navigation removed from the store (expo-router owns it); screens call router + read state.
- Verify: `tsc --noEmit` clean.

### Task 5 — Tab shell + Home ✅
- `app/(tabs)/_layout.tsx` — 4 design tabs (Wallet/Anchors/Activity/Settings), stroke
  icons, brand-500 active tint, surface bg + top border.
- `app/(tabs)/index.tsx` — Home: `BalanceHeader` (avatar/account/scan + total-balance
  block w/ success badge), `QuickActions` (5), `FeaturedBanner` (→ deposit Meridian/INRC),
  `Segmented` Tokens/Activity, token list / activity preview.
- Wallet components: `balance-header` (+`GradientAvatar`), `quick-actions`,
  `featured-banner`, `segmented`, `token-row`, `activity-row`.
- Placeholder tabs: `anchors`/`activity`/`settings`. Flow-route stubs (keep Home
  clickable, no 404s): `withdraw`/`crossborder`/`send`/`receive`/`swap`/`asset/[sym]`
  via `components/flow/stub-screen`.
- Deleted starter routes `app/(tabs)/explore.tsx`, `app/modal.tsx`.
- Verify: `tsc` clean except `/deposit` typed-route (resolves when Task 6 creates it).

### Task 6 — Deposit flow + KYC ✅
- Flow components: `flow-scaffold` (back+title header · progress · scroll · sticky
  footer), `progress-bars`, `method-card`, `quote-card`, `amount-input`,
  `status-timeline`, `status-hero` (spinner/success).
- UI primitives added: `field` (labeled TextInput), `chip` (selectable pill),
  `alert` (info/success/brand strip), `toast-host` (renders store `toast`, mounted
  at root). Added `person`/`cameraDoc` icons.
- `app/deposit.tsx` — 5 steps: Method (rail cards) → Amount (input+chips+quote) →
  Review (gated) → Pay (UPI/Card/Bank/Cash variants) → Status (hero+timeline). Header
  back = router.back at step 0 else prevStep. Amount→Review calls `requestReview`;
  diverts to `/kyc` when unverified.
- `app/kyc.tsx` — 4 steps (Personal/Address/ID/Selfie) + Verifying spinner. Watches
  one-shot `kycDone` → `router.back()` to the calling flow (now at review) or Settings.
- Toast host wired into `app/_layout.tsx` (Home scan + KYC success feedback).
- Verify (static): `tsc --noEmit` clean; full Metro bundle builds (HTTP 200, 9.4 MB,
  valid JS, all screen copy present — a broken import would 500). Deposit happy-path +
  KYC-divert + back-out-re-gate traced against the store logic.
- Verify (runtime/visual): **PENDING — this is the human check at the review gate.**
  A bundle proves it compiles/resolves, not that it renders without a redbox or matches
  the README visually.

## ✅ REVIEW GATE — Phase A approved by user (2026-07-06); proceeding to Phase B in a new session.

### Phase B — next up (fresh session)
Execute Tasks 7–15 of `docs/superpowers/plans/2026-07-06-stellar-anchor-wallet.md`,
reusing the Phase A primitives/store. Screens remaining (all have real route stubs +
typed routes already wired, and `depData`/`wdData`/`cbData`/`adData`/`assData` view-model
math is in the `.dc.html` source + `lib/quotes.ts`):
- **T7** Anchors directory `app/(tabs)/anchors.tsx` (HTML 142–182; `anchorsList`).
- **T8** Anchor detail `app/anchor/[id].tsx` (HTML 184–235; `adData`) — new route, replace nothing.
- **T9** Withdraw `app/withdraw.tsx` 4 steps (HTML 392–470; `wdData`, `withdrawQuote`) — replace stub.
- **T10** Send abroad `app/crossborder.tsx` 4 steps (HTML 542–640; `cbData`, `crossborderQuote`) — replace stub.
- **T11** Asset detail `app/asset/[sym].tsx` (`assData`; SVG sparkline) — replace stub.
- **T12** Send/Receive/Swap `app/{send,receive,swap}.tsx` (`react-native-qrcode-svg` for Receive) — replace stubs.
- **T13** Activity tab `app/(tabs)/activity.tsx` (full `ACTIVITY` via `ActivityRow`).
- **T14** Settings `app/(tabs)/settings.tsx` (account/identity/preferences; Light-theme switch drives `useTheme().setMode`; identity row opens `/kyc` via `startKyc()`).
- **T15** Polish: toast sheet-up + success pop-in + spinner spin (reanimated), prune unused starter files, final `tsc` + click-through.
Store already exposes everything these need (`startWithdraw`, `startCrossborder`,
`toggleConnect`, `isConnected`, `setMax`, `startKyc`, `toggleHide/Face/Notif`, `flash`).
