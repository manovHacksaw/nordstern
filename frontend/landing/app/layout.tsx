import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nordstern.finance"),
  title: {
    default: "NordStern — Embedded finance for Stellar anchors",
    template: "%s · NordStern",
  },
  description:
    "Launch a compliant fiat ↔ crypto on/off-ramp on Indian rails. Instant bank rails, automated KYC, and built-in compliance — one platform.",
  openGraph: {
    title: "NordStern — Embedded finance for Stellar anchors",
    description:
      "Instant fiat rails, automated KYC, and built-in compliance for Stellar anchors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
