"use client";

import { useState } from "react";
import { BadgePercent, Tag } from "lucide-react";
import { COUPONS, PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";
import { calcBreakdown, cn, mxn } from "@/lib/utils";

interface OrderSummaryProps {
  planId: PlanId;
  coupon: string;
  onCouponChange: (code: string) => void;
}

/** Resumen interactivo de costos con cupón de descuento. */
export function OrderSummary({ planId, coupon, onCouponChange }: OrderSummaryProps) {
  const plan = PLANS[planId];
  const b = calcBreakdown(planId, coupon);
  const [draft, setDraft] = useState(coupon);
  const [feedback, setFeedback] = useState<"ok" | "error" | null>(coupon ? "ok" : null);

  const apply = () => {
    const code = draft.trim().toUpperCase();
    if (COUPONS[code]) {
      onCouponChange(code);
      setFeedback("ok");
    } else {
      onCouponChange("");
      setFeedback("error");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-5">
      <p className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted">
        Resumen
        <span className="rounded-full bg-neon-purple/15 px-2.5 py-1 text-neon-magenta">{plan.shortName}</span>
      </p>

      <dl className="space-y-2.5 text-sm">
        <Row label={`${plan.name} (${plan.months} ${plan.months === 1 ? "mes" : "meses"})`} value={mxn(b.planPrice)} />
        <Row label="Inscripción" value={b.enrollmentFee ? mxn(b.enrollmentFee) : "GRATIS"} accent={!b.enrollmentFee} />
        <div className="my-3 border-t border-dashed border-white/10" />
        <Row label="Subtotal" value={mxn(b.subtotal)} />
        {b.discounts.map((d) => (
          <Row key={d.label} label={d.label} value={`- ${mxn(d.amount)}`} discount />
        ))}
      </dl>

      {/* Cupón */}
      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value.toUpperCase());
              setFeedback(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), apply())}
            placeholder="Cupón (ej. BESTIA10)"
            className="field-input h-10 py-0 pl-9 text-sm uppercase"
            aria-label="Código de cupón"
          />
        </div>
        <button
          type="button"
          onClick={apply}
          className="rounded-xl border border-neon-cyan/50 px-4 text-xs font-bold uppercase tracking-wider text-neon-cyan transition hover:bg-neon-cyan/10"
        >
          Aplicar
        </button>
      </div>
      {feedback && (
        <p className={cn("mt-2 flex items-center gap-1.5 text-xs font-semibold", feedback === "ok" ? "text-emerald-400" : "text-rose-400")}>
          <BadgePercent className="h-3.5 w-3.5" />
          {feedback === "ok" ? "¡Cupón aplicado!" : "Cupón no válido"}
        </p>
      )}

      <div className="mt-5 flex items-end justify-between rounded-xl p-4 [background:linear-gradient(90deg,rgba(176,38,255,.15),rgba(0,229,255,.1))]">
        <span className="text-sm font-bold uppercase tracking-wider">Total a pagar</span>
        <span className="font-display text-4xl leading-none text-white">{mxn(b.total)}</span>
      </div>
    </div>
  );
}

function Row({ label, value, discount, accent }: { label: string; value: string; discount?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={cn("text-slate-400", discount && "text-emerald-300/90")}>{label}</dt>
      <dd className={cn("font-semibold tabular-nums", discount && "text-emerald-300", accent && "text-neon-cyan")}>{value}</dd>
    </div>
  );
}
