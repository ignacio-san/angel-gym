"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, Building2, Check, Copy, CreditCard, Lock, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { OrderSummary } from "./OrderSummary";
import { getSpeiReference, type CardPayload } from "@/lib/api";
import type { PaymentMethod, PlanId } from "@/lib/types";
import { calcBreakdown, cn, mxn } from "@/lib/utils";

interface StepPaymentProps {
  planId: PlanId;
  coupon: string;
  onCouponChange: (c: string) => void;
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  onBack: () => void;
  onPay: (card?: CardPayload) => void;
  processing: boolean;
  error?: string;
}

const METHODS: { id: PaymentMethod; label: string; sub: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Tarjeta", sub: "Crédito / Débito", icon: CreditCard },
  { id: "spei", label: "SPEI", sub: "Transferencia", icon: Building2 },
  { id: "mercadopago", label: "Mercado Pago", sub: "Saldo / MSI", icon: Wallet },
];

/* -------------------------- helpers de tarjeta ------------------------- */

type Brand = "visa" | "mastercard" | "amex" | null;

function detectBrand(num: string): Brand {
  const n = num.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return null;
}

const formatCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function validateCard(c: CardPayload) {
  const errors: Partial<Record<keyof CardPayload, string>> = {};
  const digits = c.number.replace(/\D/g, "");
  if (digits.length < 15) errors.number = "Número incompleto";
  if (c.name.trim().length < 3) errors.name = "Escribe el nombre como aparece en la tarjeta";
  const [mm, yy] = c.expiry.split("/").map(Number);
  const now = new Date();
  const expDate = new Date(2000 + (yy || 0), mm || 0, 0);
  if (!mm || mm > 12 || !yy || expDate < now) errors.expiry = "Fecha no válida";
  if (!/^\d{3,4}$/.test(c.cvc)) errors.cvc = "CVC inválido";
  return errors;
}

/* ----------------------------- Componente ------------------------------ */

/**
 * Paso 3 — Pasarela de pago (mockup visual).
 *
 * ⚠️ PRODUCCIÓN: reemplazar el formulario de tarjeta por Stripe <PaymentElement/>
 * o el Card Payment Brick de Mercado Pago. Los datos de tarjeta jamás deben
 * pasar por tu propio servidor ni guardarse en estado persistente.
 */
export function StepPayment(props: StepPaymentProps) {
  const { planId, coupon, onCouponChange, method, onMethodChange, onBack, onPay, processing, error } = props;
  const total = calcBreakdown(planId, coupon).total;
  const [card, setCard] = useState<CardPayload>({ number: "", name: "", expiry: "", cvc: "" });
  const [flipped, setFlipped] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const spei = useMemo(() => getSpeiReference(total), [total]);
  const cardErrors = validateCard(card);
  const brand = detectBrand(card.number);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard no disponible */
    }
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const pay = () => {
    setSubmitted(true);
    if (!accepted) return;
    if (method === "card") {
      if (Object.keys(cardErrors).length) return;
      onPay(card);
    } else onPay();
  };

  const payLabel = {
    card: `Pagar ${mxn(total)}`,
    spei: "Ya realicé la transferencia",
    mercadopago: "Continuar a Mercado Pago",
  }[method];

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <h3 className="font-display text-3xl tracking-wide">Pago seguro</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <Lock className="h-3.5 w-3.5 text-emerald-400" /> Conexión cifrada · No guardamos los datos de tu tarjeta
        </p>
      </div>

      {/* Tabs de método */}
      <div role="tablist" className="grid grid-cols-3 gap-2">
        {METHODS.map(({ id, label, sub, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={method === id}
            onClick={() => onMethodChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition",
              method === id ? "border-neon-cyan bg-neon-cyan/10 shadow-glow-cyan" : "border-white/10 hover:border-white/25",
            )}
          >
            <Icon className={cn("h-5 w-5", method === id ? "text-neon-cyan" : "text-slate-400")} />
            <span className="text-xs font-bold">{label}</span>
            <span className="text-[10px] text-muted">{sub}</span>
          </button>
        ))}
      </div>

      {/* ---------- TARJETA (Stripe mockup) ---------- */}
      {method === "card" && (
        <div className="space-y-5">
          {/* Vista previa 3D de la tarjeta */}
          <div className="mx-auto w-full max-w-[340px] [perspective:1000px]">
            <div
              className="relative aspect-[1.586] w-full transition-transform duration-700 [transform-style:preserve-3d]"
              style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
            >
              {/* Frente */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-neon-purple via-fuchsia-700 to-cyan-600 p-5 shadow-glow-purple [backface-visibility:hidden]">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" />
                    <span className="font-display text-2xl italic tracking-wider">{brand ? brand.toUpperCase() : "CARD"}</span>
                  </div>
                  <p className="font-mono text-lg tracking-[0.15em] sm:text-xl">{card.number || "•••• •••• •••• ••••"}</p>
                  <div className="flex justify-between text-[11px] uppercase">
                    <div className="min-w-0">
                      <p className="opacity-70">Titular</p>
                      <p className="truncate font-semibold">{card.name || "NOMBRE APELLIDO"}</p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-70">Vence</p>
                      <p className="font-semibold">{card.expiry || "MM/AA"}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Reverso */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-700 to-ink-950 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="mt-6 h-10 bg-black" />
                <div className="mx-5 mt-5 flex items-center justify-end rounded bg-white/90 px-3 py-2 font-mono text-sm text-ink-900">
                  {card.cvc || "•••"}
                </div>
                <p className="mx-5 mt-4 text-[10px] text-slate-500">Mockup visual — integración Stripe Elements pendiente.</p>
              </div>
            </div>
          </div>

          <Field
            label="Número de tarjeta"
            name="cc-number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            icon={<CreditCard className="h-4 w-4" />}
            value={card.number}
            onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
            error={submitted ? cardErrors.number : undefined}
            hint="Prueba: 4242… aprobada · termina en 0002 rechazada"
          />
          <Field
            label="Nombre del titular"
            name="cc-name"
            autoComplete="cc-name"
            placeholder="Como aparece en la tarjeta"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
            error={submitted ? cardErrors.name : undefined}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Vencimiento"
              name="cc-exp"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
              error={submitted ? cardErrors.expiry : undefined}
            />
            <Field
              label="CVC"
              name="cc-csc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={card.cvc}
              onFocus={() => setFlipped(true)}
              onBlur={() => setFlipped(false)}
              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              error={submitted ? cardErrors.cvc : undefined}
            />
          </div>
          <p className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="h-4 w-4 text-neon-cyan" /> Procesado por <strong className="text-slate-300">Stripe</strong> · 3D Secure · PCI DSS
          </p>
        </div>
      )}

      {/* ---------- SPEI ---------- */}
      {method === "spei" && (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-ink-950/60 p-5">
          <p className="text-sm text-muted">
            Transfiere desde tu app bancaria. Tu membresía se activa automáticamente al recibir el pago (normalmente &lt; 1 min).
          </p>
          {[
            { k: "Banco", v: spei.bank },
            { k: "Beneficiario", v: spei.beneficiary },
            { k: "CLABE", v: spei.clabe, copy: true },
            { k: "Referencia", v: spei.reference, copy: true },
            { k: "Monto exacto", v: mxn(spei.amount) },
          ].map((r) => (
            <div key={r.k} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{r.k}</p>
                <p className={cn("truncate text-sm font-semibold", r.copy && "font-mono tracking-wider text-neon-cyan")}>{r.v}</p>
              </div>
              {r.copy && (
                <button
                  onClick={() => copy(r.k, r.v)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 hover:border-neon-cyan/60"
                  aria-label={`Copiar ${r.k}`}
                >
                  {copied === r.k ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---------- MERCADO PAGO ---------- */}
      {method === "mercadopago" && (
        <div className="rounded-2xl border border-[#009EE3]/40 bg-[#009EE3]/10 p-5 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[#009EE3] shadow-[0_0_30px_rgba(0,158,227,.5)]">
            <Wallet className="h-7 w-7" />
          </div>
          <p className="font-bold">Paga con tu cuenta de Mercado Pago</p>
          <p className="mt-1 text-sm text-muted">Usa tu saldo, tarjetas guardadas o hasta 3 meses sin intereses. Serás redirigido de forma segura.</p>
        </div>
      )}

      <OrderSummary planId={planId} coupon={coupon} onCouponChange={onCouponChange} />

      <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#B026FF]"
        />
        <span>
          Acepto el <a href="#" className="text-neon-cyan underline-offset-2 hover:underline">reglamento interno</a> y el{" "}
          <a href="#" className="text-neon-cyan underline-offset-2 hover:underline">aviso de privacidad</a>.
        </span>
      </label>
      {submitted && !accepted && <p className="-mt-3 text-xs font-medium text-rose-400">Debes aceptar para continuar.</p>}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" /> {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} disabled={processing} aria-label="Regresar">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          fullWidth
          onClick={pay}
          loading={processing}
          className={cn(method === "mercadopago" && "!bg-none bg-[#009EE3] shadow-[0_0_25px_rgba(0,158,227,.5)]")}
        >
          {processing ? "Procesando pago…" : payLabel}
        </Button>
      </div>
    </div>
  );
}
