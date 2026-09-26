import type { Metadata } from "next";
import Script from "next/script";
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

// Runs before paint so switching themes never flashes the wrong one.
// Defaults to dark (ESCALA's primary look) unless the viewer picked light before.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("escala-theme");
    if (stored === "light") return;
    document.documentElement.classList.add("dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* next/script's beforeInteractive strategy is Next.js's documented
            mechanism for a script that must run before hydration (avoids
            the "script tag rendered by a component" warning a raw <script>
            triggers). It still mutates <html> outside of React's own
            render, so the class the server sent and what's on the DOM by
            hydration time legitimately differ; suppressHydrationWarning
            above covers that. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
