import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { markDataUri } from "@/lib/brand-mark";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const { ink, muted, brand, up } = siteConfig.colors;

/**
 * Branded social-share image (1200×630) matching the landing page: soft
 * lavender gradient, logo lockup, headline + supporting tagline. Replace with a
 * designed asset later — the layout stays token-driven meanwhile.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#ffffff",
          backgroundImage: `radial-gradient(900px 520px at 100% -5%, ${brand}55 0%, transparent 60%), radial-gradient(760px 500px at -5% 105%, ${brand}33 0%, transparent 55%)`,
          fontFamily: "sans-serif",
        }}
      >
        {/* logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img width={64} height={64} src={markDataUri()} alt="" />
          <div style={{ fontSize: 34, fontWeight: 600, color: ink }}>
            {siteConfig.name}
          </div>
        </div>

        {/* headline + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.04,
              color: ink,
              maxWidth: 940,
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              color: muted,
              maxWidth: 860,
            }}
          >
            {siteConfig.ogDescription}
          </div>
        </div>

        {/* footer chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{ width: 12, height: 12, borderRadius: 99, background: up }}
          />
          <div style={{ fontSize: 24, color: muted }}>
            {siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
