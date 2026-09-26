"use client";

import { useCavos } from "@cavos/kit/react";
import { Wallet } from "lucide-react";

export function ConnectButton() {
  const { openModal } = useCavos();

  return (
    <button
      onClick={openModal}
      className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-amber-300"
    >
      <Wallet size={16} />
      Entrar con Google
    </button>
  );
}
