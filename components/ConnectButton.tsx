"use client";

import { useCavos } from "@cavos/kit/react";
import { shortAddress } from "@/lib/stellar";
import { LogOut, Wallet } from "lucide-react";

export function ConnectButton() {
  const { isAuthenticated, address, user, openModal, logout, walletStatus } = useCavos();

  if (isAuthenticated && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-sm font-medium text-neutral-900">
            {user?.name || user?.email || "Tu wallet"}
          </span>
          <span className="text-xs text-neutral-500">
            {shortAddress(address)}
            {walletStatus.isUndeployed && " · se activa con tu primera acción"}
          </span>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-neutral-200 p-2 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-800"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openModal}
      className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
    >
      <Wallet size={16} />
      Entrar con Google
    </button>
  );
}
