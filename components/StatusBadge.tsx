import clsx from "clsx";

type Tone = "pending" | "submitted" | "released" | "disputed";

const TONE_STYLES: Record<Tone, string> = {
  pending: "bg-neutral-100 text-neutral-600",
  submitted: "bg-amber-100 text-amber-700",
  released: "bg-emerald-100 text-emerald-700",
  disputed: "bg-red-100 text-red-700",
};

const TONE_LABELS: Record<Tone, string> = {
  pending: "Esperando conversion",
  submitted: "Conversion registrada",
  released: "Recompensa pagada",
  disputed: "En disputa",
};

export function StatusBadge({ tone }: { tone: Tone }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        TONE_STYLES[tone]
      )}
    >
      {TONE_LABELS[tone]}
    </span>
  );
}

type EscrowFlags = { released?: boolean; disputed?: boolean; resolved?: boolean } | undefined;

export function deriveTone(flags: EscrowFlags, milestoneStatus?: string): Tone {
  if (flags?.released) return "released";
  if (flags?.disputed) return "disputed";
  if ((milestoneStatus || "").toLowerCase() === "submitted") return "submitted";
  return "pending";
}
