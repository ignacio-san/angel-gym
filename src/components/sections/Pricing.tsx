"use client";

import { useState } from "react";
import { Check, Crown, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useUI } from "@/context/UIContext";
import { PLANS } from "@/lib/plans";
import type { Plan, PlanId } from "@/lib/types";
import { cn, mxn } from "@/lib/utils";

type PriceView = "total" | "mensual";

interface PlanCardProps {
  plan: Plan;
  view: PriceView;
  onSelect: (id: PlanId) => void;
  /** Slot opcional encima del precio (p. ej. switch semestral/anual) */
  switcher?: React.ReactNode;
  className?: string;
}

/** Tarjeta de plan reutilizable con efectos hover / glow. */
function PlanCard({ plan, view, onSelect, switcher, className }: PlanCardProps) {
  const perMonth = Math.round(plan.price / plan.months);
  const savings = plan.regularPrice ? plan.regularPrice - plan.price : 0;
  const hl = plan.highlighted;

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-3xl p-6 transition-all duration-500 sm:p-8",
        hl
          ? "neon-border bg-gradient-to-b from-neon-purple/20 via-ink-850/90 to-ink-850/90 shadow-glow-purple lg:-translate-y-4 lg:scale-[1.03]"
          : "glass hover:-translate-y-1 hover:border-neon-purple/40 hover:shadow-glow-sm",
        className,
      )}
    >
      {plan.badge && (
        <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-neon-gradient px-4 py-1.5 text-[11px] font-black uppercase tracking-widest shadow-glow-purple">
          <Crown className="h-3.5 w-3.5" /> {plan.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-3xl tracking-wide">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
        </div>
        {hl && <Flame className="h-7 w-7 shrink-0 text-neon-magenta drop-shadow-[0_0_8px_#D946EF]" />}
      </div>

      {switcher && <div className="mt-5">{switcher}</div>}

      <div className="mt-6 flex items-end gap-2">
        <span className={cn("font-display text-6xl leading-none sm:text-7xl", hl && "text-gradient")}>
          {mxn(view === "total" ? plan.price : perMonth)}
        </span>
        <span className="mb-1.5 text-sm font-semibold text-muted">
          {view === "total" ? (plan.months === 1 ? "/ mes" : `/ ${plan.months} meses`) : "/ mes"}
        </span>
      </div>

      <div className="mt-3 flex min-h-[28px] flex-wrap gap-2 text-xs font-semibold">
        {plan.enrollmentFee > 0 ? (
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-slate-300">+ Inscripción {mxn(plan.enrollmentFee)}</span>
        ) : (
          <span className="rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-2.5 py-1 text-neon-cyan">Sin costo de inscripción</span>
        )}
        {savings > 0 && (
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-emerald-300">Ahorras {mxn(savings)}</span>
        )}
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
            <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full", hl ? "bg-neon-gradient" : "bg-white/10")}>
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Button
        fullWidth
        size="lg"
        variant={hl ? "primary" : "outline"}
        className="mt-8"
        onClick={() => onSelect(plan.id)}
      >
        <Zap className="h-4 w-4" /> {hl ? "Quiero la Promo Bestia" : "Elegir este plan"}
      </Button>
    </article>
  );
}

export function Pricing() {
  const { openRegistration } = useUI();
  const [view, setView] = useState<PriceView>("total");
  const [longPlan, setLongPlan] = useState<"semestral" | "anual">("anual");

  return (
    <section id="planes" className="relative py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(ellipse_at_top,rgba(176,38,255,.15),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Planes & Membresías"
          title={<>Elige tu <span className="text-gradient">nivel</span></>}
          description="Precios claros, sin letras chiquitas. Paga en línea con tarjeta, SPEI o Mercado Pago y entrena hoy mismo."
        />

        {/* Toggle total / mensual */}
        <div className="mb-14 flex justify-center">
          <div className="glass inline-flex rounded-2xl p-1" role="tablist" aria-label="Vista de precios">
            {(
              [
                ["total", "Precio total"],
                ["mensual", "Costo por mes"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={view === k}
                onClick={() => setView(k)}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
                  view === k ? "bg-neon-gradient text-white shadow-glow-sm" : "text-muted hover:text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
          <PlanCard plan={PLANS.mensual} view={view} onSelect={openRegistration} className="order-2 lg:order-1" />
          <PlanCard plan={PLANS.trimestral} view={view} onSelect={openRegistration} className="order-1 lg:order-2" />
          <PlanCard
            plan={PLANS[longPlan]}
            view={view}
            onSelect={openRegistration}
            className="order-3"
            switcher={
              <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-ink-950/50 p-1 text-xs font-bold">
                {(["semestral", "anual"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setLongPlan(p)}
                    className={cn(
                      "rounded-lg py-2 uppercase tracking-wider transition",
                      longPlan === p ? "bg-neon-cyan/15 text-neon-cyan shadow-[inset_0_0_0_1px_rgba(0,229,255,.4)]" : "text-muted hover:text-white",
                    )}
                  >
                    {p === "semestral" ? "6 meses" : "12 meses"}
                  </button>
                ))}
              </div>
            }
          />
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          Precios en MXN con IVA incluido. Promoción trimestral válida hasta agotar cupo. Usa el cupón <code className="text-neon-cyan">BESTIA10</code> al pagar.
        </p>
      </div>
    </section>
  );
}
