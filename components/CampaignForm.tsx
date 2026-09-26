"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCavos } from "@cavos/kit/react";
import { useEscrowActions } from "@/hooks/useEscrowActions";
import { describeError } from "@/lib/errors";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Verificando trustline de USDC...",
  "Desplegando el contrato de la campaña...",
  "Depositando el presupuesto en el escrow...",
  "Listo, redirigiendo...",
];

export function CampaignForm() {
  const router = useRouter();
  const { address } = useCavos();
  const { createCampaign } = useEscrowActions();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("5");
  const [promoter, setPromoter] = useState("");
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitting = stepIndex !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError("Conecta tu wallet primero.");
      return;
    }
    setError(null);
    setStepIndex(0);
    try {
      setStepIndex(1);
      const contractId = await createCampaign({
        title,
        description,
        rewardAmount: Number(reward),
        businessAddress: address,
        promoterAddress: promoter.trim(),
      });
      setStepIndex(3);
      router.push(`/c/${contractId}`);
    } catch (err) {
      setError(describeError(err));
      setStepIndex(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Nombre de la campaña
        </label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Cafetería María - clientes nuevos"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Descripción / condición de la recompensa
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej. Se paga cuando un cliente nuevo muestra el código y compra en tienda."
          rows={3}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Recompensa por conversión (USDC)
        </label>
        <input
          required
          type="number"
          min="1"
          step="0.01"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Este monto se deposita ahora mismo en el escrow y se libera cuando apruebes la
          conversión.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Dirección Stellar del promotor
        </label>
        <input
          required
          value={promoter}
          onChange={(e) => setPromoter(e.target.value)}
          placeholder="G..."
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 font-mono text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-600"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Pídele a tu promotor que entre a ESCALA y copie su dirección desde su panel.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p>
      )}

      {submitting && (
        <p className="flex items-center gap-2 rounded-xl bg-neutral-200 px-4 py-3 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          <Loader2 size={16} className="animate-spin" />
          {STEPS[stepIndex]}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-amber-300 disabled:opacity-50"
      >
        {submitting ? "Creando campaña..." : "Depositar presupuesto y crear campaña"}
      </button>
    </form>
  );
}
