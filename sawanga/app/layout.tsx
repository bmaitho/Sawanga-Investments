import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const display = localFont({
  src: [
    { path: "../public/fonts/fraunces-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/fraunces-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/fraunces-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "../public/fonts/outfit-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/outfit-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/outfit-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/outfit-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/outfit-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sawangainvestments.com"),
  title: {
    default: "SAWANGA Investment Limited — Finishes That Build Trust",
    template: "%s | SAWANGA Investment Limited",
  },
  description:
    "Premium building finishes and interior solutions in Kenya. Paints, putty, tile adhesives, gypsum, granite, sanitaryware and fittings. Reliable supply, flexible developer credit, lasting value.",
  keywords: [
    "building finishes Kenya",
    "paints Nairobi",
    "tile adhesives Kenya",
    "gypsum boards",
    "sanitaryware Kenya",
    "developer credit construction supplies",
    "SAWANGA Investment",
  ],
  openGraph: {
    title: "SAWANGA Investment Limited — Finishes That Build Trust",
    description:
      "Premium building finishes and interior solutions in Kenya. Build Better. Finish Stronger.",
    url: "https://sawangainvestments.com",
    siteName: "SAWANGA Investment Limited",
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
