"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCavos } from "@cavos/kit/react";
import { useQuery } from "@tanstack/react-query";
import { useGetEscrowsFromIndexerByRole } from "@trustless-work/escrow";
import { ConnectButton } from "@/components/ConnectButton";
import { CampaignCard } from "@/components/CampaignCard";
import { DashboardShell } from "@/components/DashboardShell";
import { StatTile } from "@/components/StatTile";
import { circleUsdcFaucetUrl } from "@/lib/stellar";
import { ArrowUpRight, CheckCircle2, Coins, Megaphone, Plus, Users } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, address } = useCavos();
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();

  const asBusiness = useQuery({
    queryKey: ["escrows", "approver", address],
    queryFn: () =>
      getEscrowsByRole({ role: "approver", roleAddress: address!, orderBy: "createdAt", orderDirection: "desc" }),
    enabled: Boolean(address),
  });

  const asPromoter = useQuery({
    queryKey: ["escrows", "receiver", address],
    queryFn: () =>
      getEscrowsByRole({ role: "receiver", roleAddress: address!, orderBy: "createdAt", orderDirection: "desc" }),
    enabled: Boolean(address),
  });

  const stats = useMemo(() => {
    const campaigns = asBusiness.data ?? [];
    const released = campaigns.filter((c) => c.flags?.released);
    const promoters = new Set(
      campaigns
        .map((c) => ("receiver" in c.roles ? c.roles.receiver : undefined))
        .filter(Boolean)
    );
    return {
      campaigns: campaigns.length,
      validated: released.length,
      paidUsdc: released.reduce((sum, c) => sum + c.amount, 0),
      promoters: promoters.size,
    };
  }, [asBusiness.data]);

  if (!isAuthenticated || !address) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-2xl font-bold text-white">Entra a tu panel de ESCALA</h1>
        <p className="text-sm text-neutral-400">
          Conecta con Google para crear campanas como negocio o registrar conversiones como
          promotor. Tu wallet en Stellar se crea automaticamente.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <DashboardShell
      title="Tu panel"
      subtitle="Gestiona campanas y conversiones en Stellar."
      actions={
        <Link
          href="/dashboard/nueva"
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-neutral-900 transition hover:bg-amber-300"
        >
          <Plus size={14} />
          Nueva campana
        </Link>
      }
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Campanas" value={stats.campaigns} icon={<Megaphone size={16} />} />
        <StatTile
          label="Conversiones validadas"
          value={stats.validated}
          icon={<CheckCircle2 size={16} />}
        />
        <StatTile label="USDC pagado" value={stats.paidUsdc} icon={<Coins size={16} />} />
        <StatTile label="Promotores" value={stats.promoters} icon={<Users size={16} />} />
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm">
        <p className="text-neutral-400">
          Tu wallet se fondea sola con XLM de prueba la primera vez que crees una campana o
          registres una conversion.
        </p>
        <a
          href={circleUsdcFaucetUrl(address)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition hover:border-neutral-500"
        >
          Conseguir USDC de prueba
          <ArrowUpRight size={12} />
        </a>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold text-white">Mis campanas (negocio)</h2>

        {asBusiness.isLoading && <p className="text-sm text-neutral-500">Cargando...</p>}
        {asBusiness.data && asBusiness.data.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            Aun no creaste ninguna campana. Crea la primera y deposita el presupuesto en USDC.
          </p>
        )}
        <div className="space-y-4">
          {asBusiness.data?.map((campaign) => (
            <CampaignCard
              key={campaign.contractId || campaign.engagementId}
              campaign={campaign}
              viewerRole="approver"
              onChanged={() => asBusiness.refetch()}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Mis promociones (promotor)</h2>
        <p className="mb-4 text-sm text-neutral-500">
          Tu direccion para que un negocio te agregue a una campana:{" "}
          <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-xs text-neutral-300">
            {address}
          </span>
        </p>

        {asPromoter.isLoading && <p className="text-sm text-neutral-500">Cargando...</p>}
        {asPromoter.data && asPromoter.data.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            Todavia ningun negocio te agrego como promotor. Comparte tu direccion de arriba.
          </p>
        )}
        <div className="space-y-4">
          {asPromoter.data?.map((campaign) => (
            <CampaignCard
              key={campaign.contractId || campaign.engagementId}
              campaign={campaign}
              viewerRole="receiver"
              onChanged={() => asPromoter.refetch()}
            />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
