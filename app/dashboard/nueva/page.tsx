"use client";

import Link from "next/link";
import { useCavos } from "@cavos/kit/react";
import { ConnectButton } from "@/components/ConnectButton";
import { CampaignForm } from "@/components/CampaignForm";
import { ArrowLeft } from "lucide-react";

export default function NewCampaignPage() {
  const { isAuthenticated, address } = useCavos();

  if (!isAuthenticated || !address) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Conecta tu wallet</h1>
        <p className="text-sm text-neutral-500">
          Necesitas iniciar sesion para crear una campana y depositar el presupuesto.
        </p>
        <ConnectButton />
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
