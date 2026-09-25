"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCavos } from "@cavos/kit/react";
import { CampaignForm } from "@/components/CampaignForm";
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
      <div className="flex min-h-[70vh] items-center justify-center text-neutral-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft size={14} />
        Volver al panel
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">Nueva campana</h1>
      <p className="mb-8 text-sm text-neutral-500">
        El presupuesto se deposita en un escrow de Trustless Work en Stellar. Se libera en USDC
        al promotor solo cuando tu apruebes la conversion.
      </p>
      <CampaignForm />
    </div>
  );
}
