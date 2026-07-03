import localFont from "next/font/local";

/** ClearSans Text — body/UI default (weight 400). */
export const clearSansText = localFont({
  src: [
    {
      path: "../public/ClearSansTextRegular.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clear-text",
  display: "swap",
});

/** ClearSans Display — reserved for the hero headline (weight 700). */
export const clearSansDisplay = localFont({
  src: [
    {
      path: "../public/ClearSansDisplayRegular.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clear-display",
  display: "swap",
});
