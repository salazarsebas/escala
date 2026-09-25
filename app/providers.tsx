"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CavosProvider } from "@cavos/kit/react";
import { development, mainNet, TrustlessWorkConfig } from "@trustless-work/escrow";
import { STELLAR_NETWORK } from "@/lib/stellar";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const cavosAppId = process.env.NEXT_PUBLIC_CAVOS_APP_ID;
  const twApiKey = process.env.NEXT_PUBLIC_TW_API_KEY || "";

  return (
    <QueryClientProvider client={queryClient}>
      <TrustlessWorkConfig
        baseURL={STELLAR_NETWORK === "mainnet" ? mainNet : development}
        apiKey={twApiKey}
      >
        <CavosProvider
          config={{
            appId: cavosAppId,
            chains: ["stellar"],
            defaultChain: "stellar",
            network: STELLAR_NETWORK === "mainnet" ? "mainnet" : "testnet",
            appSalt: "escala-hackathon",
            socialRecovery: true,
          }}
          modal={{
            appName: "ESCALA",
            providers: ["google", "email"],
            theme: "light",
            primaryColor: "#facc15",
          }}
        >
          {children}
        </CavosProvider>
      </TrustlessWorkConfig>
    </QueryClientProvider>
  );
}
