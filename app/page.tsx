import Link from "next/link";
import { ArrowRight, QrCode, ShieldCheck, Sparkles, Wallet, Zap } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Crea y financia tu campana",
    detail: "Define el valor de cada resultado y tu presupuesto en USDC.",
  },
  {
    n: "02",
    title: "Conecta con tu promotor",
    detail: "ESCALA genera un QR y un enlace unico para compartir.",
  },
  {
    n: "03",
    title: "El cliente realiza la accion",
    detail: "Reserva, compra o registro desde una pagina publica simple.",
  },
  {
    n: "04",
    title: "Se valida y se libera",
    detail: "Al confirmar la conversion, la recompensa se libera en USDC.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 sm:pt-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300">
          <ShieldCheck size={14} className="text-amber-400" />
          Performance marketing con recompensas en USDC sobre Stellar
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Consigue clientes.
          <br />
          Paga por resultados.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-400">
          Conecta tu negocio con promotores, mide conversiones y recompensa unicamente los
          resultados validados. Sin asumir todo el costo de adquisicion por adelantado.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-amber-300"
          >
            Empezar
            <ArrowRight size={16} />
          </Link>
          <Link
            href="#como-funciona"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500"
          >
            Ver como funciona
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <Feature
            icon={<Zap size={18} />}
            title="Pago por resultado"
            detail="Solo pagas cuando una conversion se valida. Nada de pagar por clics o impresiones."
          />
          <Feature
            icon={<Wallet size={18} />}
            title="Wallet en un clic"
            detail="Login social con Cavos: tu wallet en Stellar se crea automaticamente, sin frases semilla."
          />
          <Feature
            icon={<QrCode size={18} />}
            title="Recompensas digitales"
            detail="Las recompensas se liberan en USDC, un dolar digital, de forma clara y trazable."
          />
        </div>
      </section>

      <section id="como-funciona" className="border-t border-neutral-900 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-white">Como funciona</h2>
          <p className="mt-2 max-w-2xl text-neutral-400">
            Un negocio define cuanto vale un resultado, un promotor lo consigue, ESCALA lo
            identifica, la conversion se valida y la recompensa se libera.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
              >
                <p className="text-xs font-semibold text-neutral-500">{step.n}</p>
                <h3 className="mt-2 font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-700 bg-neutral-100 p-6 sm:p-8">
            <div>
              <h3 className="text-xl font-bold text-neutral-900">Prueba el flujo completo</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Entra como negocio o como promotor y recorre el flujo de principio a fin en
                Stellar testnet.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Entrar al demo
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Por que blockchain, y por que Stellar
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <MiniFeature
              title="Dinero programable"
              detail="El presupuesto se bloquea y solo se libera cuando se cumple una condicion verificable."
            />
            <MiniFeature
              title="Escrow auditado"
              detail="Los fondos viven en contratos de Trustless Work sobre Soroban, no en nuestra base de datos."
            />
            <MiniFeature
              title="Costos casi nulos"
              detail="Comisiones de fraccion de centavo, ideales para micropagos y recompensas pequenas."
            />
            <MiniFeature
              title="Evidencia on-chain"
              detail="Cada campana, deposito y pago queda registrado y verificable en StellarView."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-400">
            <Sparkles size={14} />
            Stellar Odyssey Peru
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Performance marketing on-chain para microempresas
          </h2>
          <p className="mt-4 text-neutral-400">
            ESCALA permite crear campanas, reservar un presupuesto en USDC y pagar
            automaticamente a promotores cuando generan resultados verificables, mientras
            construyen un historial digital de su actividad comercial.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-amber-300"
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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-200">
        {icon}
      </div>
      <h3 className="mb-1 font-semibold text-white">{title}</h3>
      <p className="text-sm text-neutral-400">{detail}</p>
    </div>
  );
}

function MiniFeature({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <h3 className="mb-1 font-semibold text-white">{title}</h3>
      <p className="text-sm text-neutral-500">{detail}</p>
    </div>
  );
}
