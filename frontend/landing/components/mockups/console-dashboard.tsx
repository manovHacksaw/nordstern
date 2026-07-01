import { cn } from "@/lib/cn";
import {
  Grid,
  Bank,
  Bolt,
  Shield,
  Users,
  Gear,
  Eye,
  Dots,
  Contactless,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
} from "@/components/ui/icons";

export type ConsoleView = "overview" | "treasury" | "pricing";

/* --------------------------------- chrome --------------------------------- */
function Rail() {
  const items = [Grid, Bank, Bolt, Shield, Users];
  return (
    <div className="hidden w-16 shrink-0 flex-col items-center justify-between bg-noir py-5 sm:flex">
      <div className="flex flex-col items-center gap-1.5">
        {items.map((Icon, i) => (
          <span
            key={i}
            className={cn(
              "grid size-9 place-items-center rounded-xl text-[17px] transition-colors",
              i === 0 ? "bg-white/10 text-white" : "text-white/45",
            )}
          >
            <Icon />
          </span>
        ))}
      </div>
      <span className="grid size-9 place-items-center rounded-xl text-[17px] text-white/45">
        <Gear />
      </span>
    </div>
  );
}

function BrandTag() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-[15px] font-semibold">
        <span className="italic tracking-tight">Acme</span>
        <span className="rounded-md bg-brand-200 px-1.5 py-0.5 text-[10px] font-bold not-italic tracking-wide text-brand-800">
          PAY
        </span>
      </div>
      <div className="flex items-center gap-2 text-subtle">
        <span className="size-7 rounded-full bg-surface-2" />
      </div>
    </div>
  );
}

/** Small header row with reveal/more controls, matching the reference cards. */
function CardControls({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-[13px] font-medium text-ink">{label}</p>
      <div className="flex items-center gap-2 text-subtle">
        <Eye className="text-sm" />
        <Dots className="text-sm" />
      </div>
    </div>
  );
}

/* --------------------------------- pieces --------------------------------- */
function ActivityRow({
  name,
  meta,
  method,
  amount,
  dir,
}: {
  name: string;
  meta: string;
  method: string;
  amount: string;
  dir: "in" | "out";
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full text-sm",
          dir === "in"
            ? "bg-[color:var(--color-up)]/12 text-[color:var(--color-up)]"
            : "bg-surface-2 text-muted",
        )}
      >
        {dir === "in" ? <ArrowDownLeft /> : <ArrowUpRight />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-ink">{name}</p>
        <p className="truncate text-[11px] text-subtle">{meta}</p>
      </div>
      <span className="hidden rounded-md bg-surface px-2 py-1 text-[11px] font-medium text-muted sm:inline">
        {method}
      </span>
      <span
        className={cn(
          "w-24 text-right text-[13px] font-medium tabular-nums",
          dir === "in" ? "text-[color:var(--color-up)]" : "text-ink",
        )}
      >
        {amount}
      </span>
    </div>
  );
}

function CardVisual() {
  return (
    <div className="relative aspect-[1.585/1] overflow-hidden rounded-xl bg-gradient-to-br from-brand-100 via-brand-200 to-brand-300 p-4 text-brand-800 shadow-sm">
      {/* soft engraved waves */}
      <svg
        aria-hidden
        viewBox="0 0 320 200"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
        fill="none"
      >
        <path d="M-20 150C60 120 120 180 220 130S360 60 360 60" stroke="#fff" strokeWidth="1.2" />
        <path d="M-20 175C60 145 120 205 220 155S360 85 360 85" stroke="#fff" strokeWidth="1.2" />
      </svg>
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-semibold">Acme Pay Reserve</span>
          <Contactless className="text-base text-white/90" />
        </div>
        <div className="h-5 w-7 rounded-[4px] bg-white/45 ring-1 ring-white/40" />
        <div className="flex items-end justify-between">
          <span className="font-mono text-[13px] tracking-[0.18em] text-brand-800/90">
            ••••&nbsp;4401
          </span>
          <span className="text-[11px] font-semibold italic">RuPay</span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- views ---------------------------------- */
function Overview() {
  const rows = [
    { name: "UPI in · Razorpay", meta: "Verified · today", method: "UPI", amount: "+₹42,000", dir: "in" as const },
    { name: "Off-ramp · payout", meta: "Settled · today", method: "IMPS", amount: "−₹17,900", dir: "out" as const },
    { name: "NEFT in · HDFC", meta: "Verified · yesterday", method: "NEFT", amount: "+₹1,28,600", dir: "in" as const },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      {/* main */}
      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(20,20,43,0.05)] ring-1 ring-black/[0.04]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] text-subtle">Reserve balance</p>
            <p className="mt-1.5 text-[30px] font-medium leading-none tracking-tight tabular-nums sm:text-[38px]">
              ₹1,02,00,400
            </p>
          </div>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[color:var(--color-up)]/12 px-2 py-1 text-[11px] font-medium text-[color:var(--color-up)]">
            <ArrowUpRight className="text-xs" /> 2.4%
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-100 px-3 py-1.5 text-[12px] font-medium text-brand-800">
            <ArrowUpRight className="text-sm" /> Pay out
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface px-3 py-1.5 text-[12px] font-medium text-muted">
            <ArrowDownLeft className="text-sm" /> Get paid
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { l: "Account number", v: "•••• •••• 2298" },
            { l: "IFSC", v: "HDFC0001435" },
          ].map((f) => (
            <div key={f.l} className="rounded-lg border border-line px-3 py-2">
              <p className="text-[11px] text-subtle">{f.l}</p>
              <p className="mt-0.5 text-[13px] font-medium tracking-wide">{f.v}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-line pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium">Recent activity</p>
            <p className="text-[11px] text-subtle">Last 24h</p>
          </div>
          <div className="mt-1 divide-y divide-line">
            {rows.map((r) => (
              <ActivityRow key={r.name} {...r} />
            ))}
          </div>
        </div>
      </div>

      {/* aside */}
      <div className="space-y-3">
        <div className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(20,20,43,0.05)] ring-1 ring-black/[0.04]">
          <CardControls label="Anchor card · Virtual" />
          <CardVisual />
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(20,20,43,0.05)] ring-1 ring-black/[0.04]">
          <CardControls label="Reserve wallet" />
          <div className="relative aspect-[1.585/1] overflow-hidden rounded-xl bg-noir p-4 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold">Acme Pay</span>
              <span className="rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold text-ink">
                XLM
              </span>
            </div>
            <p className="mt-5 font-mono text-[13px] tracking-[0.18em] text-white/80">
              G••••X29
            </p>
            <p className="mt-1 text-[11px] text-white/50">Stellar reserve</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Treasury() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="space-y-4">
        <div className="rounded-xl bg-brand-100 px-4 py-3 text-center text-[13px] font-medium text-brand-800">
          Pre-approved liquidity line of up to <b>₹50,00,000</b>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(20,20,43,0.05)] ring-1 ring-black/[0.04]">
          <div className="flex items-center gap-3">
            <span className="grid size-6 place-items-center rounded-full bg-ink text-[11px] font-medium text-white">
              1
            </span>
            <p className="text-[13px] font-medium">Select the amount</p>
            <span className="ml-auto rounded-md border border-brand px-3 py-1 text-[13px] font-medium tabular-nums">
              ₹20,00,000
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-[11px] text-subtle">
            <span>₹10L</span>
            <div className="relative h-1.5 flex-1 rounded-full bg-surface-2">
              <div className="h-full w-2/5 rounded-full bg-ink" />
              <span className="absolute left-2/5 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-1 ring-black/10" />
            </div>
            <span>₹50L</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(20,20,43,0.05)] ring-1 ring-black/[0.04]">
          <div className="flex items-center gap-3">
            <span className="grid size-6 place-items-center rounded-full bg-ink text-[11px] font-medium text-white">
              2
            </span>
            <p className="text-[13px] font-medium">Account to fund</p>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-surface px-3 py-2.5 text-[13px]">
            <span className="font-medium">HDFC · Current</span>
            <span className="text-subtle">•••• 1435</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 p-5 text-center">
        <span className="mx-auto grid size-8 place-items-center rounded-full bg-white text-[color:var(--color-up)] shadow-sm">
          <Check className="text-sm" />
        </span>
        <p className="mt-3 text-[12px] text-brand-800">Approved for</p>
        <p className="text-[26px] font-medium tracking-tight text-ink">₹20,00,000</p>
        <p className="mt-1 text-[11px] text-brand-800/70">Funds in ~2 min</p>
      </div>
    </div>
  );
}

function Pricing() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(20,20,43,0.05)] ring-1 ring-black/[0.04]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium">Spread schedule</p>
        <span className="rounded-pill bg-brand-100 px-2.5 py-1 text-[11px] font-medium text-brand-800">
          Live
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { t: "On-ramp", v: "0.90%" },
          { t: "Off-ramp", v: "1.10%" },
          { t: "Net margin", v: "0.42%" },
        ].map((c) => (
          <div key={c.t} className="rounded-lg bg-surface p-3">
            <p className="text-[11px] text-subtle">{c.t}</p>
            <p className="mt-1 text-[17px] font-medium tracking-tight">{c.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex h-24 items-end gap-1.5">
        {[40, 55, 48, 62, 70, 58, 75, 82, 68, 88].map((h, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t",
              i === 9 ? "bg-brand" : "bg-brand-200",
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[12px] text-[color:var(--color-up)]">
        <Check className="text-sm" /> Backtest: +3.1% margin vs last schedule
      </div>
    </div>
  );
}

const VIEWS: Record<ConsoleView, () => React.ReactElement> = {
  overview: Overview,
  treasury: Treasury,
  pricing: Pricing,
};

/**
 * Stylized NordStern anchor console. Pure markup (no client JS) — the hero tab
 * switcher swaps `view`. Mirrors the reference dashboard: dark left rail,
 * branded header, layered white cards with hairline borders + soft shadows.
 */
export function ConsoleDashboard({ view }: { view: ConsoleView }) {
  const ViewBody = VIEWS[view];
  return (
    <div className="flex w-full overflow-hidden rounded-[1.4rem] bg-surface shadow-[0_28px_90px_-40px_rgba(76,63,158,0.35)] ring-1 ring-black/[0.05]">
      <Rail />
      <div className="min-w-0 flex-1 p-5 sm:p-6">
        <BrandTag />
        <div className="mt-5">
          <ViewBody />
        </div>
      </div>
    </div>
  );
}
