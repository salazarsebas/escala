"use client";

import { useState } from "react";
import Link from "next/link";
import type { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow";
import { deriveTone, StatusBadge } from "./StatusBadge";
import { useEscrowActions } from "@/hooks/useEscrowActions";
import { explorerContractUrl, shortAddress } from "@/lib/stellar";
import { ArrowUpRight, Loader2 } from "lucide-react";

type Props = {
  campaign: GetEscrowsFromIndexerResponse;
  viewerRole: "approver" | "receiver";
  onChanged?: () => void;
};

export function CampaignCard({ campaign, viewerRole, onChanged }: Props) {
  const { submitConversion, approveAndRelease } = useEscrowActions();
  const [evidence, setEvidence] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const contractId = campaign.contractId;
  const milestone = campaign.milestones[0];
  const tone = deriveTone(campaign.flags, milestone?.status);
  const roles = campaign.roles;
  const promoterAddress = "receiver" in roles ? roles.receiver : undefined;

  const handleSubmitConversion = async () => {
    if (!promoterAddress || !contractId) return;
    setBusy(true);
    setError(null);
    try {
      const result = await submitConversion(contractId, promoterAddress, evidence);
      setLastMessage(result.message);
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la conversion.");
    } finally {
      setBusy(false);
    }
  };

  const handleApproveAndRelease = async () => {
    if (!contractId) return;
    const approver = roles.approver;
    setBusy(true);
    setError(null);
    try {
      const result = await approveAndRelease(contractId, approver);
      setLastMessage(result.message);
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo liberar el pago.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-neutral-900">{campaign.title}</h3>
          <p className="mt-0.5 text-sm text-neutral-500">{campaign.description}</p>
        </div>
        <StatusBadge tone={tone} />
      </div>

      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-500">
        <span>
          Recompensa: <strong className="text-neutral-800">{campaign.amount} USDC</strong>
        </span>
        {promoterAddress && (
          <span>
            Promotor: <span className="font-mono">{shortAddress(promoterAddress)}</span>
          </span>
        )}
      </div>

      {viewerRole === "receiver" && tone === "pending" && (
        <div className="space-y-2">
          <input
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Evidencia (ej. numero de boleta, foto, referencia)"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <button
            onClick={handleSubmitConversion}
            disabled={busy || !evidence.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            Registrar conversion
          </button>
        </div>
      )}

      {viewerRole === "approver" && tone === "submitted" && (
        <button
          onClick={handleApproveAndRelease}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          Aprobar y liberar pago
        </button>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {lastMessage && <p className="mt-2 text-xs text-emerald-700">{lastMessage}</p>}

      {contractId && (
        <div className="mt-4 flex items-center gap-4 border-t border-neutral-100 pt-3 text-xs">
          <Link href={`/c/${contractId}`} className="text-neutral-500 underline">
            Ver pagina publica
          </Link>
          <a
            href={explorerContractUrl(contractId)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-neutral-500 underline"
          >
            Ver en Stellar Expert
            <ArrowUpRight size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
