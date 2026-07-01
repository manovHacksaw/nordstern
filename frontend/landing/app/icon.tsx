import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { markDataUri } from "@/lib/brand-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser-tab favicon: NordStern mark on an ink tile (high contrast at 16–32px). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: siteConfig.colors.ink,
        }}
      >
        {/* white ring + purple comet reads cleanly on the dark tile */}
        <img width={22} height={22} src={markDataUri("#ffffff")} alt="" />
      </div>
    ),
    { ...size },
  );
}
