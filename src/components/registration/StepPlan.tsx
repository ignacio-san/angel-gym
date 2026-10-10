"use client";

import { ArrowLeft, ArrowRight, CalendarDays, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BRANCHES } from "@/lib/constants";
import { PLAN_ORDER, PLANS, SHIFTS } from "@/lib/plans";
import type { MembershipPreferences, ShiftId } from "@/lib/types";
import { addDays, addMonths, cn, formatDate, mxn, parseISO, todayISO } from "@/lib/utils";

interface StepPlanProps {
  prefs: MembershipPreferences;
  onChange: (prefs: MembershipPreferences) => void;
  onBack: () => void;
  onNext: () => void;
}

/** Nivel de afluencia típico por turno (alimenta la sugerencia visual). */
const SHIFT_TRAFFIC: Record<ShiftId, { label: string; color: string }> = {
  madrugada: { label: "Tranquilo", color: "text-emerald-400" },
  manana: { label: "Moderado", color: "text-neon-cyan" },
  tarde: { label: "Moderado", color: "text-neon-cyan" },
  noche: { label: "Hora pico", color: "text-rose-400" },
};

function nextMonday() {
  const d = parseISO(todayISO());
  const delta = ((8 - d.getDay()) % 7) || 7;
  return addDays(todayISO(), delta);
}

/** Paso 2 — Plan, sucursal, horario preferido y fecha de inicio. */
export function StepPlan({ prefs, onChange, onBack, onNext }: StepPlanProps) {
  const set = <K extends keyof MembershipPreferences>(k: K, v: MembershipPreferences[K]) => onChange({ ...prefs, [k]: v });
  const today = todayISO();
  const quickDates = [
    { label: "Hoy", value: today },
    { label: "Mañana", value: addDays(today, 1) },
    { label: "Próx. lunes", value: nextMonday() },
  ];
  const endDate = addMonths(prefs.startDate, PLANS[prefs.planId].months);

  return (
    <div className="animate-fade-up space-y-7">
      <div>
        <h3 className="font-display text-3xl tracking-wide">Tu plan</h3>
        <p className="text-sm text-muted">Puedes cambiar de plan aquí mismo; el total se recalcula al instante.</p>
      </div>

      {/* Selector de plan */}
      <div role="radiogroup" aria-label="Plan" className="grid grid-cols-2 gap-3">
        {PLAN_ORDER.map((id) => {
          const p = PLANS[id];
          const active = prefs.planId === id;
          return (
            <button
              key={id}
              role="radio"
              aria-checked={active}
              onClick={() => set("planId", id)}
              className={cn(
                "relative rounded-2xl border p-4 text-left transition-all",
                active ? "border-neon-purple bg-neon-purple/10 shadow-glow-sm" : "border-white/10 bg-white/[0.02] hover:border-white/25",
              )}
            >
              {p.highlighted && (
                <span className="absolute -top-2 right-3 rounded-full bg-neon-gradient px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                  Promo
                </span>
              )}
              <span className={cn("absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border", active ? "border-transparent bg-neon-gradient" : "border-white/20")}>
                {active && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <p className="font-display text-xl tracking-wide">{p.shortName}</p>
              <p className="text-lg font-bold">{mxn(p.price)}</p>
              <p className="text-[11px] text-muted">
                {p.months} {p.months === 1 ? "mes" : "meses"} · {p.enrollmentFee ? `+${mxn(p.enrollmentFee)} insc.` : "sin inscripción"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Sucursal */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">Sucursal</p>
        <div className="space-y-2">
          {BRANCHES.map((b) => (
            <label
              key={b.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition",
                prefs.branchId === b.id ? "border-neon-cyan/60 bg-neon-cyan/5" : "border-white/10",
              )}
            >
              <input type="radio" name="branch" className="sr-only" checked={prefs.branchId === b.id} onChange={() => set("branchId", b.id)} />
              <MapPin className="h-5 w-5 shrink-0 text-neon-cyan" />
              <span className="flex-1">
                <span className="block text-sm font-bold">{b.name}</span>
                <span className="block text-xs text-muted">{b.address}, {b.city}</span>
              </span>
              <Check className={cn("h-4 w-4 text-neon-cyan", prefs.branchId !== b.id && "invisible")} />
            </label>
          ))}
        </div>
      </div>

      {/* Horario preferido */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">Horario preferido</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SHIFTS.map((s) => {
            const active = prefs.preferredShift === s.id;
            const t = SHIFT_TRAFFIC[s.id];
            return (
              <button
                key={s.id}
                onClick={() => set("preferredShift", s.id)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left transition",
                  active ? "border-neon-magenta bg-neon-magenta/10" : "border-white/10 hover:border-white/25",
                )}
              >
                <p className="text-sm font-bold">{s.label}</p>
                <p className="text-[11px] text-muted">{s.range}</p>
                <p className={cn("mt-1 text-[10px] font-bold uppercase tracking-wider", t.color)}>● {t.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fecha de inicio */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">¿Cuándo empiezas a entrenar?</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {quickDates.map((q) => (
            <button
              key={q.label}
              onClick={() => set("startDate", q.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-bold transition",
                prefs.startDate === q.value ? "border-neon-cyan bg-neon-cyan/15 text-neon-cyan" : "border-white/10 text-slate-300 hover:border-white/30",
              )}
            >
              {q.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="date"
            className="field-input pl-11"
            value={prefs.startDate}
            min={today}
            max={addDays(today, 30)}
            onChange={(e) => e.target.value && set("startDate", e.target.value)}
            aria-label="Fecha de inicio"
          />
        </div>
        <p className="mt-3 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-4 py-3 text-sm">
          Tu membresía será válida del <strong>{formatDate(prefs.startDate)}</strong> al{" "}
          <strong className="text-neon-cyan">{formatDate(endDate)}</strong>.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} aria-label="Regresar">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button size="lg" fullWidth onClick={onNext}>
          Ir a pagar <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
