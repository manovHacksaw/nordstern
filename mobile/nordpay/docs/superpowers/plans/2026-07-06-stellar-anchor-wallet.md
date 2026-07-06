# Stellar Anchor Wallet (nordpay) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the "Stellar Anchor Wallet" design handoff as a native Expo / React Native app (nordpay) — a dark, Phantom-class wallet whose defining feature is deep Stellar anchor support (deposit / withdraw / cross-border / KYC), running on mock data.

**Architecture:** `expo-router` for navigation (tab group + pushed full-screen flow routes); a single Zustand store that mirrors the design prototype's `DCLogic` state machine (mirrored 1:1: balances, flow `step`, selections, KYC gating + return); a thin `lib/` mock-data seam (anchors, quotes, transfers, kyc) shaped so real SEP-1/10/12/24/31/38 can slot in later. All amounts/settlement are simulated — this is a demo build, no real funds, no Freighter signing.

**Tech Stack:** Expo SDK 54 (New Architecture), React 19, expo-router v6, Zustand, react-native-svg, react-native-qrcode-svg, expo-font (JetBrains Mono + Inter), react-native-reanimated v4 (already present).

## Global Constraints

- **Expo SDK 54, New Architecture on** (`newArchEnabled: true`). Install native deps with `npx expo install <pkg>` (SDK-pinned), never bare `npm install <latest>`. Read https://docs.expo.dev/versions/v54.0.0/ before adding APIs.
- **Demo/mock only.** No real network, no real money, no Freighter/keys. Settlement is timer-simulated exactly like the prototype (`processing` → `converting` @1.2s → `completed` @2.6s).
- **Design fidelity is authoritative.** Exact hex, radii, spacing, copy, and sample data come from `design_handoff_stellar_anchor_wallet/README.md` and the `<script type="text/x-dc">` block in `Stellar Anchor Wallet.dc.html` (lines 783–1082). When in doubt, match the HTML.
- **Numbers use JetBrains Mono** (balances, amounts, addresses, %, rates, codes, timestamps). Display/headings use General Sans → **fallback Inter 600** (General Sans is acceptable to skip). Body uses Inter.
- **No device chrome.** Do NOT recreate the fake phone frame, notch, or "9:41" status bar — that's the design tool's shell. Use real `SafeAreaView` insets.
- **Theme:** dark is default; a Settings "Light theme" switch overrides. Both palettes are specified in the design tokens.
- **Money movement is status-driven** (mirrors NordStern's async model) — screens react to `txStatus`, they don't block.

## Design token reference (verbatim — used by Task 1)

```
Brand (Perano): brand-50 #F5F2FF · brand-100 #E2DFFE · brand-300 #C7BEF7 · brand-500 #AB9FF2 (primary) · brand-700 #8B7EE0 · brand-900 #3C315B
Dark:  canvas #1A1A1A · surface #211F29 · surface-2 #2A2733 · border rgba(152,151,156,0.24) · text #FFFFFF · text-2 #98979C · text-3 rgba(152,151,156,0.6)
Light: canvas #FFFFFF · surface #F5F2FF · surface-2 #E2DFFE · border rgba(60,49,91,0.12) · text #1A1A1A · text-2 #6B6770 · text-3 rgba(60,49,91,0.5) · brand-text #8B7EE0
Semantic: success #2EC08B / fill rgba(46,192,139,0.16) · warning #F2B84B / fill rgba(242,184,75,0.16) · error #FF4444 / fill rgba(255,68,68,0.16) · info #7DB8F2 / fill rgba(125,184,242,0.16) · overlay rgba(0,0,0,0.8)
Radius: sm 8 · md 16 · lg 24 · xl 32 · full 999
Shadow md: 0 8px 24px rgba(60,49,91,0.16)
Type scale: total-balance mono 42/600 · h1 26/600 (-0.02em) · section 15–16/600 · body 13.5–14.5 · caption 11–13 · mono figures 11–16
Spacing: 4px scale; screen gutters 16–18; card padding 14–16
```

## Sample data (verbatim — used by Task 3, from the `.dc.html` logic)

- **Prices:** XLM 0.1218 · USDC 1 · EURC 1.09 · INRC 0.012004 · NGNC 0.00065
- **Balances:** XLM 4208.55 · USDC 1250 · EURC 300 · INRC 18400
- **Asset meta:** XLM "Stellar Lumens" #5B54C9 +3.24% up (Native) · USDC "USD Coin" #2775CA 0.00% (Circle) · EURC "Euro Coin" #1A4D8F +0.12% (Circle) · INRC "Indian Rupee" #00B39F 0.00% (Meridian). Order: XLM, USDC, EURC, INRC.
- **Fiat map:** INRC→INR ₹ · USDC→USD $ · EURC→EUR € · NGNC→NGN ₦
- **6 anchors, 8 methods, 7 activity rows, walletAddr `GBQK…7X4F9A2B`** — copy exactly from `.dc.html` lines 813–855.

---

## Phase A — Vertical slice (build, run, then PAUSE for user review)

### Task 1: Foundation — deps, fonts, theme tokens

**Files:**
- Modify: `package.json` (via `npx expo install`)
- Modify: `app.json` (fonts plugin if using static files — else expo-font runtime)
- Create: `constants/tokens.ts` — Perano token maps (dark + light), radius, spacing, shadow, font role names
- Create: `theme/theme-context.tsx` — `ThemeProvider` + `useTheme()` returning the active token set, plus `mode`/`setMode('dark'|'light'|'system')`
- Create: `theme/fonts.ts` — font family constants + `useAppFonts()` hook wrapping `expo-font`
- Modify: `app/_layout.tsx` — load fonts (gate render on ready), wrap tree in `ThemeProvider`, keep splash until fonts loaded
- Modify: `constants/theme.ts` — re-export bridge so existing imports don't break (keep `Colors`/`Fonts`, add nothing breaking)

**Interfaces:**
- Produces: `useTheme(): { c: ColorTokens; radius; space; shadow; mode; setMode }`, `Font = { display, body, mono }` (resolved family names), `useAppFonts(): boolean`.

- [ ] **Step 1:** `npx expo install react-native-svg react-native-qrcode-svg @expo-google-fonts/jetbrains-mono @expo-google-fonts/inter expo-font` and `npm install zustand`. Verify versions land in `package.json`.
- [ ] **Step 2:** Write `constants/tokens.ts` with `dark` and `light` `ColorTokens` objects (exact hex/rgba from the token reference above), `radius`, `space` (4px scale), `shadowMd`.
- [ ] **Step 3:** Write `theme/fonts.ts`: export `Font = { display: 'Inter_600SemiBold', body: 'Inter_400Regular', mono: 'JetBrainsMono_500Medium', monoBold: 'JetBrainsMono_600SemiBold' }` and `useAppFonts()` using `useFonts` from the google-fonts packages.
- [ ] **Step 4:** Write `theme/theme-context.tsx` — context storing `mode` (default `'dark'`), resolving to token set via system scheme when `'system'`; expose `useTheme()`.
- [ ] **Step 5:** Wire `app/_layout.tsx`: call `useAppFonts()`, return null / keep splash until true, wrap `<Stack>` in `<ThemeProvider>`; set root background to `c.canvas`.
- [ ] **Step 6 (verify):** `npx tsc --noEmit` passes; `npx expo start --web`, confirm app boots to a canvas-colored screen and JetBrains Mono renders (drop a temporary `<Text style={{fontFamily: Font.mono}}>1,234.56</Text>` and eyeball it, then remove).

### Task 2: Primitives — reusable UI atoms + icons

**Files:**
- Create: `components/ui/icon.tsx` — `<Icon name path size stroke color />` thin wrapper over `react-native-svg` `Path` (stroke-based, 1.75–2px, `strokeLinecap/join round`), plus an `ICONS` map of the design's SVG path data (deposit/withdraw/send/receive/swap/scan/chevron/back/globe/check/copy/close + method icons from `MICON`).
- Create: `components/ui/text.tsx` — `<AppText variant>` presets (`display`, `h1`, `title`, `body`, `caption`, `mono`, `monoLg`) reading theme + Font.
- Create: `components/ui/badge.tsx` — pill badge with `tone` (success/info/warning/error) → fill+text color.
- Create: `components/ui/button.tsx` — `<PrimaryButton>` (brand-500 fill, radius full, disabled state) + `<SecondaryButton>` (surface-2, radius md).
- Create: `components/ui/card.tsx` — surface card (radius lg, border, padding 14–16).
- Create: `components/ui/screen.tsx` — `<Screen>` wrapper (SafeArea + canvas bg + optional scroll) and `<FlowHeader title onBack>` (back arrow; hidden when specified).

**Interfaces:**
- Produces: `Icon`, `ICONS`, `AppText`, `Badge`, `PrimaryButton`, `SecondaryButton`, `Card`, `Screen`, `FlowHeader`.

- [ ] **Step 1:** Build `Icon` + `ICONS` (copy path strings from `TICON`/`MICON` in `.dc.html` lines 823–836, plus header icons from the HTML markup: scan `M4 8V6a2 2 0 0 1 2-2h2…`, back/chevron, etc.).
- [ ] **Step 2:** Build `AppText` variants mapping to type scale (Task 1 tokens/fonts).
- [ ] **Step 3:** Build `Badge`, `PrimaryButton`, `SecondaryButton`, `Card`, `Screen`, `FlowHeader`.
- [ ] **Step 4 (verify):** `npx tsc --noEmit`; render a scratch screen showing one of each primitive in dark mode; eyeball radii/colors against README; remove scratch.

### Task 3: Data seam + formatting helpers

**Files:**
- Create: `lib/format.ts` — `fmt(n, dp=2)`, `parse(str)`, `money(n)`, `fiatSym(code)` (mirror `.dc.html` `fmt`/`parse`/`money`).
- Create: `lib/anchors.ts` — `ANCHORS`, `METHODS`, `MICON` ids, `anchorById`, `issuerAnchor(sym)` (verbatim from `.dc.html` 813–846).
- Create: `lib/assets.ts` — `PRICES`, `META`, `ORDER`, `FIAT` (verbatim 804–812).
- Create: `lib/activity.ts` — `ACTIVITY` seed rows + `STONE`/`SCOLOR` status maps (847–855, 837–838).
- Create: `lib/quotes.ts` — `depositQuote({fiat, anchor, asset})` and `withdrawQuote({amount, anchor, asset})` and `crossborderQuote({amount})` returning `{ youPay/youSend, fee, feePct, rate, youGet, eta }` (mirror `depData`/`wdData`/`cbData` math: fee = amount × `feeNum`; cross-border rate 1650, 1% fee).

**Interfaces:**
- Produces: all the above as typed exports. `Anchor`, `AssetSym = 'XLM'|'USDC'|'EURC'|'INRC'`, `Quote` types.

- [ ] **Step 1:** Write `lib/format.ts`; add a Jest-free sanity check by importing in a scratch and logging `fmt(4208.55)` → `"4,208.55"`, `parse('5,000')` → `5000`.
- [ ] **Step 2:** Write `lib/assets.ts`, `lib/anchors.ts`, `lib/activity.ts` (verbatim data).
- [ ] **Step 3:** Write `lib/quotes.ts` pure functions.
- [ ] **Step 4 (verify):** `npx tsc --noEmit` clean; the seam compiles and the sample data matches the HTML (spot-check Meridian feeNum 0.005, rate lines).

### Task 4: Zustand store (the state machine)

**Files:**
- Create: `store/wallet-store.ts` — mirrors `.dc.html` `state` + actions.

**Interfaces:**
- Produces: `useWallet()` with state `{ balances, homeTab, flow, step, anchorId, asset, method, fiat, assetAmt, destType, dest, cb*, kycVerified, kycStep, kycReturn, k*, txStatus, conn, balancesHidden, faceId, notif, toast }` and actions `{ total(), isConnected(id), setField(k,v), setMethod(m), proceed(), prevStep(), needKyc(), toReview(returnStep), gotoKyc(screen,step), kycNext(), kycBack(), finishKyc(), runTx(), toggleConnect(id), flash(tone,title,msg), setMax(), reset() }`.

- [ ] **Step 1:** Define the store state (initial values verbatim from `.dc.html` 790–802: `fiat:'5,000'`, `assetAmt:'4,975'`, `anchorId:'meridian'`, `asset:'INRC'`, `kName:'Aarav Sharma'`, etc.).
- [ ] **Step 2:** Implement pure/simple actions (`setField`, `setMethod`, `proceed`, `total`, `isConnected`, `toggleConnect`, `flash` with 3.2s auto-clear timeout).
- [ ] **Step 3:** Implement flow control: `toReview` (if `needKyc()` → `gotoKyc(step:2)` else `step=2`), `gotoKyc`, `kycNext`, `kycBack`, `finishKyc` (1.8s → `kycVerified=true`, flash success, restore return).
- [ ] **Step 4:** Implement `runTx()`: set `txStatus:'processing'`, timers → `'converting'` @1200ms, `'completed'` @2600ms mutating the relevant balance (deposit +, withdraw −, crossborder −USDC). Clear timers on re-run.
- [ ] **Step 5 (verify):** `npx tsc --noEmit`; unit-drive in a scratch: call `runTx()` for deposit and assert (via logs) balance increases after ~2.6s; remove scratch.

### Task 5: Tab shell + Wallet/Home screen

**Files:**
- Modify: `app/(tabs)/_layout.tsx` — 4 tabs (Wallet/Anchors/Activity/Settings) with the design's stroke icons, brand-500 active tint, surface bg, top border; remove starter Home/Explore.
- Replace: `app/(tabs)/index.tsx` → Wallet/Home.
- Create placeholder tabs: `app/(tabs)/anchors.tsx`, `app/(tabs)/activity.tsx`, `app/(tabs)/settings.tsx` (minimal, filled in Phase B).
- Delete: `app/(tabs)/explore.tsx`, `app/modal.tsx` (unused starter); prune starter components later.
- Create: `components/wallet/quick-actions.tsx`, `components/wallet/featured-banner.tsx`, `components/wallet/token-row.tsx`, `components/wallet/activity-row.tsx`, `components/wallet/segmented.tsx`, `components/wallet/balance-header.tsx`.

**Interfaces:**
- Consumes: Task 2 primitives, Task 3 data (`tokensList` equivalent, `activityList`), Task 4 store.
- Produces: reusable `TokenRow`, `ActivityRow`, `Segmented`, `FeaturedBanner`, `QuickActions` for later screens.

- [ ] **Step 1:** Rebuild `app/(tabs)/_layout.tsx` with the 4 design tabs + stroke icons.
- [ ] **Step 2:** Build Home per README §1: top row (avatar gradient "AR" · "Account 1 ▾" · scan), centered total-balance block (mono 42, success badge `+$48.20 · +2.13%`), 5 quick actions, featured gradient banner ("Add money instantly / UPI, Google Pay & bank via Meridian" → opens Deposit preset Meridian/INRC), Tokens|Activity segmented, then list. Gradient via `expo-linear-gradient` (`npx expo install`).
- [ ] **Step 3:** Wire quick actions: Deposit/Withdraw → push flow routes (Task 6); Send/Receive/Swap → push (stubs OK until Phase B); scan → toast.
- [ ] **Step 4 (verify):** Run `npx expo start --web` (and iOS if available); confirm Home matches README §1 — balance renders in mono, token rows show `4,208.55 XLM` etc., segmented toggles Tokens/Activity, banner + quick actions tappable.

### Task 6: Deposit flow (5 steps + KYC divert)  ⭐ core

**Files:**
- Create: `app/deposit.tsx` — single route; renders step 0–4 from store `step`; `FlowHeader` back calls `store.prevStep()` (decrements step, pops route at step 0); sticky footer button per step; progress = 4 bars + mono caption (hidden at step 4).
- Create: `app/kyc.tsx` — 4 steps + verifying (built now because Deposit review diverts into it).
- Create: `components/flow/progress-bars.tsx`, `components/flow/quote-card.tsx`, `components/flow/method-card.tsx`, `components/flow/status-timeline.tsx`, `components/flow/amount-input.tsx`.

**Interfaces:**
- Consumes: Task 4 store (`depData`-equivalent selectors), Task 3 `depositQuote`, Task 2 primitives.

- [ ] **Step 1:** Add flow routes to `app/_layout.tsx` `<Stack>` (`deposit`, `kyc`, plus withdraw/crossborder/asset/send/receive/swap declared now, screens later) with `headerShown:false`, `animation:'slide_from_right'`.
- [ ] **Step 2:** Step 0 Method — "Adding INRC via Meridian" summary + method cards for anchor rails (icon tile · label · desc · green speed badge), selected = 1.5px brand border; footer disabled "Choose a method" → "Continue". (README §4 step 0 + `METHODS`.)
- [ ] **Step 3:** Step 1 Amount+quote — centered mono input prefixed fiat symbol; 3 quick-amount chips (`₹1,000/5,000/10,000`); quote card You pay / Anchor fee ·X% / Rate / **You receive** (brand mono) / "Arrives {settle}".
- [ ] **Step 4:** Step 2 Review — big "you'll receive"; summary card; green "Identity verified" strip. Footer "Confirm". **Gate:** on entering review, if `!kycVerified` → `gotoKyc` then return to step 2.
- [ ] **Step 5:** Step 3 Pay — method-specific: UPI/GPay → "Paying to Meridian · meridian@stellar" + 4-app picker; Card → card inputs; Bank → beneficiary/IFSC/name + info alert; Cash → mono reference `MG-4821-9930`. Footer "Pay {amount}" → `runTx()`.
- [ ] **Step 6:** Step 4 Status — spinner → success check pop-in; 3-row timeline (Payment received → Converting to INRC → Delivered) advancing on `txStatus`; on completion balance already bumped by store; footer "Done" → home.
- [ ] **Step 7:** Build `app/kyc.tsx` 4 steps (Personal / Address / ID document w/ type chips + dashed drop zone / Selfie 160px dashed circle → green check) + Verifying spinner (1.8s) → `finishKyc()`.
- [ ] **Step 8 (verify):** Run the app. Drive Deposit end-to-end from Home banner: pick UPI → enter amount → review **with KYC off** (confirm it diverts to KYC, complete it, returns to review) → pay → watch timeline complete → confirm INRC balance increased on Home. Repeat with KYC pre-verified (no divert).

### ⏸ REVIEW GATE — stop here, demo the slice to the user, get feedback before Phase B.

---

## Phase B — Fan-out (after review approval)

Each screen reuses Phase A primitives/store; same build+run verification.

- **Task 7 — Anchors directory** (`app/(tabs)/anchors.tsx`): H1 + "Send money abroad" banner (→ crossborder) + Connected/Available groups; anchor cards (README §2).
- **Task 8 — Anchor detail** (`app/anchor/[id].tsx`): avatar/name/tagline, connect toggle pill, blurb, Supported assets chips, Funding methods rows, fee/settlement/identity card, sticky Deposit/Withdraw footer (README §3, `adData`).
- **Task 9 — Withdraw flow** (`app/withdraw.tsx`, 4 steps): Amount (MAX chip) → Destination (UPI/Bank/Cash segmented) → Review (KYC-gated) → Status (README §5, `wdData`).
- **Task 10 — Send abroad / cross-border** (`app/crossborder.tsx`, 4 steps): Recipient (country chips + delivery method + name/account) → Amount (USDC→local, ₦) → Review (SEP-31 alert) → Status (README §6, `cbData`).
- **Task 11 — Asset detail** (`app/asset/[sym].tsx`): avatar/mono balance/%; SVG sparkline (Perano area+line); Deposit/Withdraw/Swap; issuer card; filtered Recent (README §8, `assData`).
- **Task 12 — Send / Receive / Swap** (`app/send.tsx`, `app/receive.tsx`, `app/swap.tsx`): Send (amount+recipient+memo → toast home); Receive (real QR of `walletAddr` via `react-native-qrcode-svg` + copy); Swap (pay/receive cards + swap toggle + rate → toast) (README §9).
- **Task 13 — Activity tab** (`app/(tabs)/activity.tsx`): full history list w/ status tones (README §5 list style + `activityList`).
- **Task 14 — Settings** (`app/(tabs)/settings.tsx`): account card (avatar/name/mono address/copy), Identity verification row (Verified/Not → opens KYC), Preferences switches (Hide balances, Face ID, Notifications, Light theme → drives theme context), Security group (README §12).
- **Task 15 — Polish pass:** toast host (sheet-up 320ms, pinned above tabs, auto-dismiss 3.2s), success pop-in (400ms bounce), spinner spin, reduced-motion respect; prune remaining starter files (`components/hello-wave`, `parallax-scroll-view`, etc.) not in use; final `tsc --noEmit` + click-through of every flow.

---

## Verification model (this is a UI recreation — read carefully)

Formal unit tests are **not** the primary verification here; the deliverable is visual/interactive fidelity. Each task's "verify" step means:
1. `npx tsc --noEmit` clean (typed routes + store types catch most wiring bugs).
2. `npx expo start --web` boots without redbox; the screen matches its README section (colors, mono numbers, copy, layout).
3. For flows: **drive them by hand** — every step advances, back works, KYC divert + return works, `txStatus` timeline completes, the correct balance mutates.

Pure logic (`lib/format.ts`, `lib/quotes.ts`, store math) is simple enough to spot-check via scratch logs; add lightweight assertions there only if a value looks off.

## Self-review notes

- **Spec coverage:** All 12 README screens map to tasks 5–14; tokens/fonts→T1, primitives→T2, data seam→T3, store→T4, polish/animations→T15. KYC gating covered in T6 (built early because Deposit needs it).
- **Type consistency:** store action names used across tasks are fixed in T4's Interfaces block (`prevStep`, `toReview`, `gotoKyc`, `runTx`, `setField`, `setMax`). Quote fn names fixed in T3.
- **Deps:** native installs (`react-native-svg`, `qrcode-svg`, `linear-gradient`, google-fonts) all via `npx expo install`; `zustand` is pure JS.
