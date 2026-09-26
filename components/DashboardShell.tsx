"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useCavos } from "@cavos/kit/react";
import { shortAddress } from "@/lib/stellar";
import { LogOut, Sparkles } from "lucide-react";

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { address, user, logout, walletStatus } = useCavos();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-900 bg-neutral-950 px-5 py-6 sm:flex">
        <Link href="/" className="mb-1 flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-neutral-900">
            <Sparkles size={16} />
          </span>
          <span className="text-lg font-bold">ESCALA</span>
        </Link>
        <p className="mb-8 text-xs font-medium uppercase tracking-wide text-neutral-500">
          Panel
        </p>

        <div className="mt-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-500">Conectado como</p>
          <p className="mt-0.5 truncate text-sm font-medium text-white">
            {user?.name || user?.email || "Tu cuenta"}
          </p>
          {address && (
            <p className="mt-1 font-mono text-xs text-neutral-500">
              {shortAddress(address)}
              {walletStatus.isUndeployed && " · sin activar"}
            </p>
          )}
          <button
            onClick={logout}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition hover:text-neutral-200"
          >
            <LogOut size={12} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-900 px-6 py-6 sm:px-10">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>}
          </div>
          {actions}
        </header>
        <main className="px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
