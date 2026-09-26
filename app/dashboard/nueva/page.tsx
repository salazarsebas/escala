"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCavos } from "@cavos/kit/react";
import { CampaignForm } from "@/components/CampaignForm";
import { DashboardShell } from "@/components/DashboardShell";
import { ArrowLeft, Loader2 } from "lucide-react";

// Cavos's OAuth redirect target is the exact page the login started from, so
// every page that can trigger `login()` needs its own callback URL
// whitelisted in the Cavos console. Keeping /dashboard as the ONLY page that
// renders ConnectButton means the console only ever needs one entry.
export default function NewCampaignPage() {
  const router = useRouter();
  const { isAuthenticated, address } = useCavos();

  useEffect(() => {
    if (!isAuthenticated || !address) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, address, router]);

  if (!isAuthenticated || !address) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <DashboardShell
      title="Nueva campaña"
      subtitle="El presupuesto se deposita en un escrow de Trustless Work en Stellar. Se libera en USDC al promotor solo cuando tu apruebes la conversión."
    >
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
        >
          <ArrowLeft size={14} />
          Volver al panel
        </Link>
        <CampaignForm />
      </div>
    </DashboardShell>
  );
}
