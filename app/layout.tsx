import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://escala.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ESCALA - Convierte tus ventas en crecimiento",
    template: "%s | ESCALA",
  },
  description:
    "ESCALA es una plataforma de performance marketing on-chain para microempresas: crea campanas, deposita presupuesto en USDC y paga automaticamente a tus promotores cuando consiguen resultados verificables en Stellar.",
  keywords: [
    "Stellar",
    "Soroban",
    "USDC",
    "performance marketing",
    "microempresas",
    "Peru",
    "escrow",
    "Trustless Work",
  ],
  openGraph: {
    title: "ESCALA - Convierte tus ventas en crecimiento",
    description:
      "Paga por resultados verificables. Presupuesto de marketing programable en USDC sobre Stellar.",
    url: siteUrl,
    siteName: "ESCALA",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ESCALA - Convierte tus ventas en crecimiento",
    description: "Paga por resultados verificables. Marketing on-chain para microempresas.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
