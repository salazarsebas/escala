"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy } from "lucide-react";

export function QrShare({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="rounded-xl border border-neutral-100 p-3">
        <QRCodeSVG value={url} size={176} level="M" />
      </div>
      <button
        onClick={copy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </button>
      <p className="break-all text-center text-xs text-neutral-400">{url}</p>
    </div>
  );
}
