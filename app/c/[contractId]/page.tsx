"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import { QrShare } from "@/components/QrShare";
import { explorerContractUrl, shortAddress } from "@/lib/stellar";
import { Loader2, Sparkles } from "lucide-react";
import clsx from "clsx";

type Tone = "pending" | "submitted" | "released" | "disputed";

const TONE_STYLES: Record<Tone, string> = {
  pending: "bg-neutral-100 text-neutral-600",
  submitted: "bg-amber-100 text-amber-700",
  released: "bg-emerald-100 text-emerald-700",
  disputed: "bg-red-100 text-red-700",
};

const TONE_LABELS: Record<Tone, string> = {
  pending: "Esperando conversión",
  submitted: "Conversión registrada",
  released: "Recompensa pagada",
  disputed: "En disputa",
};

function deriveTone(
  flags: { released?: boolean; disputed?: boolean } | undefined,
  milestoneStatus?: string
): Tone {
  if (flags?.released) return "released";
  if (flags?.disputed) return "disputed";
  if ((milestoneStatus || "").toLowerCase() === "submitted") return "submitted";
  return "pending";
}

export default function PublicCampaignPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = use(params);
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["escrow", contractId],
    queryFn: async () => {
      const results = await getEscrowByContractIds({ contractIds: [contractId] });
      const escrow = results[0];
      if (!escrow) throw new Error("Campaña no encontrada");
      return escrow;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-neutral-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="text-xl font-bold text-neutral-900">Campaña no encontrada</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Verifica el enlace o el código QR que te compartieron.
          </p>
        </div>
      </div>
    );
  }

  const milestone = data.milestones[0];
  const tone = deriveTone(data.flags, milestone?.status);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl px-6 py-14">
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
          <Sparkles size={14} />
          Campaña ESCALA en Stellar
        </div>

        <h1 className="text-3xl font-bold text-neutral-900">{data.title}</h1>
        <p className="mt-3 text-neutral-600">{data.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              TONE_STYLES[tone]
            )}
          >
            {TONE_LABELS[tone]}
          </span>
          <span className="text-sm text-neutral-500">
            Recompensa por conversión verificada:{" "}
            <strong className="text-neutral-900">{data.amount} USDC</strong>
          </span>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:items-start">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-neutral-900">Comparte este código</h2>
            <p className="mb-4 text-sm text-neutral-500">
              Muéstralo a un cliente nuevo. Cuando complete la compra, el promotor registra la
              conversión desde su panel de ESCALA y el pago en USDC se libera on-chain.
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
                Depositados en un escrow Trustless Work sobre Soroban, verificable en
                StellarView.
              </p>
            </div>
            <Link href="/dashboard" className="inline-block text-neutral-500 underline">
              ¿Eres el promotor? Entra a tu panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
