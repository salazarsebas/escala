"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useGetEscrow } from "@trustless-work/escrow";
import { deriveTone, StatusBadge } from "@/components/StatusBadge";
import { QrShare } from "@/components/QrShare";
import { explorerContractUrl, shortAddress } from "@/lib/stellar";
import { Loader2, Sparkles } from "lucide-react";

export default function PublicCampaignPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = use(params);
  const { getEscrow } = useGetEscrow();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["escrow", contractId],
    queryFn: () => getEscrow(contractId),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-neutral-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-xl font-bold text-neutral-900">Campana no encontrada</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Verifica el enlace o el codigo QR que te compartieron.
        </p>
      </div>
    );
  }

  const { escrow } = data;
  const { snapshot } = escrow;
  const amount = "amount" in snapshot ? snapshot.amount : null;
  const milestone = snapshot.milestones[0];
  const tone = deriveTone(escrow.status, milestone?.status);

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
        <Sparkles size={14} />
        Campana ESCALA en Stellar
      </div>

      <h1 className="text-3xl font-bold text-neutral-900">{snapshot.title}</h1>
      <p className="mt-3 text-neutral-600">{snapshot.description}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <StatusBadge tone={tone} />
        {amount !== null && (
          <span className="text-sm text-neutral-500">
            Recompensa por conversion verificada:{" "}
            <strong className="text-neutral-900">{amount} USDC</strong>
          </span>
        )}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:items-start">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-neutral-900">Comparte este codigo</h2>
          <p className="mb-4 text-sm text-neutral-500">
            Muestralo a un cliente nuevo. Cuando complete la compra, el promotor registra la
            conversion desde su panel de ESCALA y el pago en USDC se libera on-chain.
          </p>
          {shareUrl && <QrShare url={shareUrl} />}
        </div>

        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 text-sm">
          <div>
            <p className="text-neutral-400">Contrato del escrow</p>
            <a
              href={explorerContractUrl(contractId)}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-neutral-800 underline"
            >
              {shortAddress(contractId, 6)}
            </a>
          </div>
          <div>
            <p className="text-neutral-400">Fondos</p>
            <p className="text-neutral-800">
              Depositados en un escrow Trustless Work sobre Soroban, verificable en Stellar
              Expert.
            </p>
          </div>
          <Link href="/dashboard" className="inline-block text-neutral-500 underline">
            Eres el promotor? entra a tu panel
          </Link>
        </div>
      </div>
    </div>
  );
}
