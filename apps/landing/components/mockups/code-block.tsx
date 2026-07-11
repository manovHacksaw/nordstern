const LINES = [
  { t: "curl -X POST https://api.nordstern.dev/ramps \\", c: "text-white/90" },
  { t: "  -H 'Authorization: Bearer $TOKEN' \\", c: "text-white/60" },
  { t: "  -d '{", c: "text-white/60" },
  { t: '    "type": "onramp",', c: "text-brand-200" },
  { t: '    "rail": "UPI",', c: "text-brand-200" },
  { t: '    "amount": "20000",', c: "text-brand-200" },
  { t: '    "asset": "USDC"', c: "text-brand-200" },
  { t: "  }'", c: "text-white/60" },
];

/** Terminal-style cURL snippet for the "Custom" build path. */
export function CodeBlock() {
  return (
    <div className="rounded-mock bg-noir p-5 font-mono text-[13px] leading-relaxed shadow-lg">
      <div className="mb-3 flex gap-1.5">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
      </div>
      {LINES.map((l, i) => (
        <p key={i} className={l.c}>
          {l.t}
        </p>
      ))}
    </div>
  );
}
