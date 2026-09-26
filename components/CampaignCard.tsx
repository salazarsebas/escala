"use client";

import { useState } from "react";
import Link from "next/link";
import type { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow";
import { deriveTone, StatusBadge } from "./StatusBadge";
import { useEscrowActions } from "@/hooks/useEscrowActions";
import { explorerContractUrl, shortAddress } from "@/lib/stellar";
import { describeError } from "@/lib/errors";
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
      setError(describeError(err));
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
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{campaign.title}</h3>
          <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
            {campaign.description}
          </p>
        </div>
        <StatusBadge tone={tone} />
      </div>

      <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
        <div>
          <p className="text-xs text-neutral-500">Recompensa</p>
          <p className="font-medium text-neutral-900 dark:text-white">
            {campaign.amount} USDC
          </p>
        </div>
        {promoterAddress && (
          <div>
            <p className="text-xs text-neutral-500">Promotor</p>
            <p className="font-mono text-neutral-700 dark:text-neutral-300">
              {shortAddress(promoterAddress)}
            </p>
          </div>
        )}
      </div>

      {viewerRole === "receiver" && tone === "pending" && (
        <div className="space-y-2">
          <input
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Evidencia (ej. numero de boleta, foto, referencia)"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-600"
          />
          <button
            onClick={handleSubmitConversion}
            disabled={busy || !evidence.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
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
          className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-neutral-900 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          Aprobar y liberar pago
        </button>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {lastMessage && <p className="mt-2 text-xs text-emerald-400">{lastMessage}</p>}

      {contractId && (
        <div className="mt-4 flex items-center gap-4 border-t border-neutral-200 pt-3 text-xs dark:border-neutral-800">
          <Link
            href={`/c/${contractId}`}
            className="text-neutral-500 underline hover:text-neutral-900 dark:hover:text-neutral-300"
          >
            Ver pagina publica
          </Link>
          <a
            href={explorerContractUrl(contractId)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-neutral-500 underline hover:text-neutral-900 dark:hover:text-neutral-300"
          >
            Ver en StellarView
            <ArrowUpRight size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
