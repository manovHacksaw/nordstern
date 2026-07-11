import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { markDataUri } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon (opaque, rounded, generous padding). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: siteConfig.colors.ink,
        }}
      >
        <img width={112} height={112} src={markDataUri("#ffffff")} alt="" />
      </div>
    ),
    { ...size },
  );
}
