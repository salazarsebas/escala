import { ReactNode } from "react";

export function StatTile({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: ReactNode;
  caption?: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
      {caption && <p className="mt-1 text-xs text-neutral-500">{caption}</p>}
    </div>
  );
}
