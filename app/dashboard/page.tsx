"use client";

import Link from "next/link";
import { useCavos } from "@cavos/kit/react";
import { useQuery } from "@tanstack/react-query";
import { useListEscrows } from "@trustless-work/escrow";
import { ConnectButton } from "@/components/ConnectButton";
import { CampaignCard } from "@/components/CampaignCard";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, address } = useCavos();
  const { listEscrows } = useListEscrows();

  const asBusiness = useQuery({
    queryKey: ["escrows", "approver", address],
    queryFn: () =>
      listEscrows({ participant: address!, role: "approver", sort: "createdAt", order: "desc" }),
    enabled: Boolean(address),
  });

  const asPromoter = useQuery({
    queryKey: ["escrows", "receiver", address],
    queryFn: () =>
      listEscrows({ participant: address!, role: "receiver", sort: "createdAt", order: "desc" }),
    enabled: Boolean(address),
  });

  if (!isAuthenticated || !address) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Entra a tu panel de ESCALA</h1>
        <p className="text-sm text-neutral-500">
          Conecta con Google para crear campanas como negocio o registrar conversiones como
          promotor. Tu wallet en Stellar se crea automaticamente.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tu panel</h1>
          <p className="text-sm text-neutral-500">Gestiona campanas y conversiones en Stellar.</p>
        </div>
        <ConnectButton />
      </header>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Mis campanas (negocio)</h2>
          <Link
            href="/dashboard/nueva"
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            <Plus size={14} />
            Nueva campana
          </Link>
        </div>

        {asBusiness.isLoading && <p className="text-sm text-neutral-400">Cargando...</p>}
        {asBusiness.data && asBusiness.data.data.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Aun no creaste ninguna campana. Crea la primera y deposita el presupuesto en USDC.
          </p>
        )}
        <div className="space-y-4">
          {asBusiness.data?.data.map((campaign) => (
            <CampaignCard
              key={campaign.contractId}
              campaign={campaign}
              viewerRole="approver"
              onChanged={() => asBusiness.refetch()}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Mis promociones (promotor)</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Tu direccion para que un negocio te agregue a una campana:{" "}
          <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs">{address}</span>
        </p>

        {asPromoter.isLoading && <p className="text-sm text-neutral-400">Cargando...</p>}
        {asPromoter.data && asPromoter.data.data.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
            Todavia ningun negocio te agrego como promotor. Comparte tu direccion de arriba.
          </p>
        )}
        <div className="space-y-4">
          {asPromoter.data?.data.map((campaign) => (
            <CampaignCard
              key={campaign.contractId}
              campaign={campaign}
              viewerRole="receiver"
              onChanged={() => asPromoter.refetch()}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
