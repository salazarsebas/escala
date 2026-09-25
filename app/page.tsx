import Link from "next/link";
import { ArrowRight, QrCode, ShieldCheck, Wallet, Zap } from "lucide-react";

const STEPS = [
  { title: "Crea tu campana", detail: "Define presupuesto y recompensa por cliente conseguido." },
  { title: "Deposita en USDC", detail: "El presupuesto queda en un escrow verificable en Stellar." },
  { title: "Comparte el QR", detail: "Tu promotor recibe un link y lo comparte con clientes nuevos." },
  { title: "Paga por resultados", detail: "Apruebas la conversion y el smart contract libera el pago." },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 sm:pt-32">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
          Performance marketing on-chain · Stellar + Soroban + USDC
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
          Convierte tus ventas en crecimiento.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-600">
          ESCALA ayuda a microempresas a conseguir nuevos clientes y pagar por resultados
          verificables, sin asumir todo el costo de adquisicion por adelantado. Consigue
          clientes. Paga por resultados. Crece.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Entrar a mi panel
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard/nueva"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300"
          >
            Crear mi primera campana
          </Link>
        </div>
      </section>

      <section className="border-y border-neutral-100 bg-neutral-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Como funciona
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-1 font-semibold text-neutral-900">{step.title}</h3>
                <p className="text-sm text-neutral-500">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Por que blockchain, y por que Stellar
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<Zap size={18} />}
            title="Dinero programable"
            detail="El presupuesto se bloquea y solo se libera cuando se cumple una condicion verificable."
          />
          <Feature
            icon={<Wallet size={18} />}
            title="Wallet en un clic"
            detail="Login social con Cavos: negocios y promotores obtienen una wallet Stellar sin frases semilla."
          />
          <Feature
            icon={<ShieldCheck size={18} />}
            title="Escrow auditado"
            detail="Los fondos viven en contratos de Trustless Work sobre Soroban, no en nuestra base de datos."
          />
          <Feature
            icon={<QrCode size={18} />}
            title="Evidencia on-chain"
            detail="Cada campana, deposito y pago queda registrado y verificable en Stellar Expert."
          />
        </div>
      </section>

      <section className="border-t border-neutral-100 bg-neutral-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold">
            Estamos construyendo ESCALA para el Hackathon Stellar Odyssey Peru
          </h2>
          <p className="mt-4 text-neutral-300">
            Una plataforma de performance marketing on-chain que permite a las microempresas
            crear campanas, reservar un presupuesto en USDC y pagar automaticamente a promotores
            cuando generan resultados verificables.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            Probar la demo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        {icon}
      </div>
      <h3 className="mb-1 font-semibold text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-500">{detail}</p>
    </div>
  );
}
