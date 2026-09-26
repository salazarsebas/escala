"use client";

import { ReactNode, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCavos } from "@cavos/kit/react";
import { useEscrowActions } from "@/hooks/useEscrowActions";
import { shortAddress } from "@/lib/stellar";
import { ThemeToggle } from "./ThemeToggle";
import { LayoutDashboard, LogOut, Plus, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/nueva", label: "Nueva campaña", icon: Plus },
];

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
  const { ensureDeployedAndUsdcTrustline } = useEscrowActions();
  const pathname = usePathname();

  // DashboardShell only renders once Cavos has authenticated the user, so
  // this is the earliest safe point to deploy the wallet and open its USDC
  // trustline: by the time they reach the campaign or conversion form,
  // that setup is already done instead of blocking on their first action.
  // createCampaign/submitConversion still call this themselves as a
  // fallback, so a failure here just means the user sees it there instead.
  const trustlineSetupStarted = useRef(false);
  useEffect(() => {
    if (!address || trustlineSetupStarted.current) return;
    trustlineSetupStarted.current = true;
    ensureDeployedAndUsdcTrustline().catch(() => {
      trustlineSetupStarted.current = false;
    });
  }, [address, ensureDeployedAndUsdcTrustline]);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 px-5 py-6 sm:flex dark:border-neutral-900 dark:bg-neutral-950">
        <Link href="/" className="mb-8 flex items-center gap-2 text-neutral-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-neutral-900">
            <Sparkles size={16} />
          </span>
          <span className="text-lg font-bold">ESCALA</span>
        </Link>

        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
          Panel
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-amber-400/15 text-amber-700 dark:text-amber-300"
                    : "text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mb-2 mt-auto flex justify-end">
          <ThemeToggle />
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-500">Conectado como</p>
          <p className="mt-0.5 truncate text-sm font-medium text-neutral-900 dark:text-white">
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
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <LogOut size={12} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 sm:hidden dark:border-neutral-900">
          <Link href="/" className="flex items-center gap-2 text-neutral-900 dark:text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-neutral-900">
              <Sparkles size={14} />
            </span>
            <span className="font-bold">ESCALA</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {address && (
              <>
                <span className="font-mono text-xs text-neutral-500">
                  {shortAddress(address)}
                </span>
                <button
                  onClick={logout}
                  className="rounded-full border border-neutral-200 p-1.5 text-neutral-500 transition hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-6 py-6 sm:px-10 dark:border-neutral-900">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>
            )}
          </div>
          {actions}
        </header>
        <main className="px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
