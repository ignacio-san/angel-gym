"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CreditCard,
  Hash,
  IdCard,
  PartyPopper,
  Phone,
  RefreshCcw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { DigitalMembershipCard } from "@/components/membership/DigitalMembershipCard";
import { useUI } from "@/context/UIContext";
import { computeRenewal, lookupMember, renewMembership } from "@/lib/api";
import { PLAN_ORDER, PLANS } from "@/lib/plans";
import type { Member, PlanId } from "@/lib/types";
import { cn, daysBetween, formatDate, formatPhone, mxn, todayISO } from "@/lib/utils";

type Mode = "phone" | "id";

/** Socios de demostración (ver semillas en lib/api.ts) */
const DEMO = [
  { label: "Carlos · 12 días", q: "477 123 4567", mode: "phone" as Mode },
  { label: "Mariana · por vencer", q: "AG-2077", mode: "id" as Mode },
  { label: "Jorge · vencida", q: "AG-0666", mode: "id" as Mode },
];

/**
 * Portal rápido de renovación.
 * TODO(backend): en producción, tras buscar por teléfono, enviar un OTP por
 * WhatsApp/SMS (Twilio, Meta Cloud API) antes de mostrar el estado de cuenta.
 */
export function RenewalPortal() {
  const { renewalOpen, closeRenewal, openRegistration } = useUI();
  const [mode, setMode] = useState<Mode>("phone");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [renewPlan, setRenewPlan] = useState<PlanId>("mensual");
  const [renewing, setRenewing] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // Reinicia al cerrar
  useEffect(() => {
    if (!renewalOpen) {
      const t = setTimeout(() => {
        setMember(null);
        setQuery("");
        setNotFound(false);
        setRenewed(false);
        setShowCard(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [renewalOpen]);

  const search = async (q = query, m = mode) => {
    if (!q.trim()) return;
    setLoading(true);
    setNotFound(false);
    const found = await lookupMember(m === "phone" ? q.replace(/\D/g, "") : q);
    setLoading(false);
    if (found) {
      setMember(found);
      setRenewPlan(found.planId);
    } else setNotFound(true);
  };

  const renew = async () => {
    if (!member) return;
    setRenewing(true);
    const updated = await renewMembership(member, renewPlan);
    setRenewing(false);
    setMember(updated);
    setRenewed(true);
  };

  return (
    <Modal
      open={renewalOpen}
      onClose={closeRenewal}
      locked={renewing}
      title={
        <p className="flex items-center gap-2 font-display text-xl tracking-wider">
          <RefreshCcw className="h-4 w-4 text-neon-cyan" /> Mi cuenta · Renovación
        </p>
      }
    >
      {!member ? (
        /* ------------------------- LOGIN RÁPIDO ------------------------- */
        <form
          className="animate-fade-up space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <div>
            <h3 className="heading-display text-4xl">
              Renueva en <span className="text-gradient">1 clic</span>
            </h3>
            <p className="mt-1 text-sm text-muted">Consulta tu vigencia y renueva sin hacer fila en recepción.</p>
          </div>

          <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-ink-950/50 p-1" role="tablist">
            {(
              [
                ["phone", "Teléfono", Phone],
                ["id", "ID de socio", IdCard],
              ] as const
            ).map(([k, label, Icon]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={mode === k}
                onClick={() => {
                  setMode(k);
                  setQuery("");
                  setNotFound(false);
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition",
                  mode === k ? "bg-neon-cyan/15 text-neon-cyan shadow-[inset_0_0_0_1px_rgba(0,229,255,.4)]" : "text-muted",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          <div className="relative">
            {mode === "phone" ? (
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            ) : (
              <Hash className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            )}
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setNotFound(false);
                setQuery(mode === "phone" ? formatPhone(e.target.value) : e.target.value.toUpperCase());
              }}
              inputMode={mode === "phone" ? "numeric" : "text"}
              placeholder={mode === "phone" ? "477 123 4567" : "AG-1024"}
              className="field-input h-14 pl-12 text-lg tracking-wider"
              aria-label={mode === "phone" ? "Número de WhatsApp" : "ID de socio"}
              aria-invalid={notFound}
            />
          </div>

          {notFound && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm">
              <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <p className="font-semibold text-rose-200">No encontramos una membresía con ese dato.</p>
                <button type="button" onClick={() => openRegistration()} className="mt-1 text-neon-cyan hover:underline">
                  ¿Eres nuevo? Inscríbete aquí →
                </button>
              </div>
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={loading} disabled={!query.trim()}>
            {!loading && <Search className="h-5 w-5" />} Consultar mi membresía
          </Button>

          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">Prueba con socios demo</p>
            <div className="flex flex-wrap gap-2">
              {DEMO.map((d) => (
                <button
                  key={d.q}
                  type="button"
                  onClick={() => {
                    setMode(d.mode);
                    setQuery(d.q);
                    search(d.q, d.mode);
                  }}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-neon-purple/60 hover:text-white"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      ) : (
        <AccountView
          member={member}
          renewPlan={renewPlan}
          onRenewPlan={setRenewPlan}
          renewing={renewing}
          renewed={renewed}
          showCard={showCard}
          onToggleCard={() => setShowCard((s) => !s)}
          onRenew={renew}
          onBack={() => {
            setMember(null);
            setRenewed(false);
            setShowCard(false);
          }}
        />
      )}
    </Modal>
  );
}

/* ======================= Estado de cuenta ======================= */

interface AccountViewProps {
  member: Member;
  renewPlan: PlanId;
  onRenewPlan: (p: PlanId) => void;
  renewing: boolean;
  renewed: boolean;
  showCard: boolean;
  onToggleCard: () => void;
  onRenew: () => void;
  onBack: () => void;
}

function AccountView({ member, renewPlan, onRenewPlan, renewing, renewed, showCard, onToggleCard, onRenew, onBack }: AccountViewProps) {
  const today = todayISO();
  const remaining = daysBetween(today, member.endDate);
  const total = Math.max(1, daysBetween(member.startDate, member.endDate));
  const expired = remaining < 0;
  const tone = expired || remaining <= 3 ? "danger" : remaining <= 7 ? "warning" : "neon";
  const { newEndDate } = computeRenewal(member, renewPlan);
  const addedDays = daysBetween(expired ? today : member.endDate, newEndDate);

  // Anima el anillo desde 0 al montar
  const [ringValue, setRingValue] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRingValue(expired ? 0 : remaining / total));
    return () => cancelAnimationFrame(id);
  }, [remaining, total, expired]);

  return (
    <div className="animate-fade-up space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" /> Cambiar de cuenta
      </button>

      {renewed && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm animate-scale-in">
          <PartyPopper className="h-6 w-6 shrink-0 text-emerald-300" />
          <p>
            <strong className="text-emerald-200">¡Renovación exitosa!</strong> Tu nueva vigencia es hasta el{" "}
            <strong className="text-white">{formatDate(member.endDate)}</strong>. Te enviamos el comprobante por WhatsApp.
          </p>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <CircularProgress value={ringValue} size={190} tone={tone}>
          <div>
            <p className={cn("font-display text-6xl leading-none", expired ? "text-rose-400" : "text-white")}>
              {expired ? 0 : remaining}
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">{remaining === 1 ? "día restante" : "días restantes"}</p>
          </div>
        </CircularProgress>

        <div className="w-full flex-1 space-y-3 text-center sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neon-cyan">{member.id}</p>
            <h3 className="heading-display text-4xl">Hola, {member.fullName.split(" ")[0]}</h3>
          </div>
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
              expired
                ? "bg-rose-500/15 text-rose-300"
                : remaining <= 7
                  ? "bg-amber-400/15 text-amber-300"
                  : "bg-emerald-400/15 text-emerald-300",
            )}
          >
            {expired ? `Vencida hace ${Math.abs(remaining)} días` : remaining <= 7 ? "Por vencer" : "Activa"}
          </span>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/[0.03] p-3">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Plan actual</dt>
              <dd className="font-semibold">{PLANS[member.planId].shortName}</dd>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-3">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{expired ? "Venció" : "Vence"}</dt>
              <dd className="font-semibold">{formatDate(member.endDate)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <button onClick={onToggleCard} className="w-full rounded-xl border border-white/10 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:border-neon-cyan/50">
        {showCard ? "Ocultar credencial" : "Ver mi credencial QR"}
      </button>
      {showCard && (
        <div className="animate-scale-in py-2">
          <DigitalMembershipCard member={member} />
        </div>
      )}

      {/* Renovación */}
      <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Renovar con</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PLAN_ORDER.map((id) => (
            <button
              key={id}
              onClick={() => onRenewPlan(id)}
              className={cn(
                "rounded-xl border p-3 text-left transition",
                renewPlan === id ? "border-neon-purple bg-neon-purple/10 shadow-glow-sm" : "border-white/10 hover:border-white/25",
              )}
            >
              <p className="text-sm font-bold">{PLANS[id].shortName}</p>
              <p className="text-xs text-muted">{mxn(PLANS[id].price)}</p>
            </button>
          ))}
        </div>

        {/* Recálculo automático de vigencia */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 p-4 text-sm">
          <CalendarCheck className="h-5 w-5 shrink-0 text-neon-cyan" />
          <p>
            Nueva vigencia: <strong className="text-white">{formatDate(newEndDate)}</strong>{" "}
            <span className="text-neon-cyan">(+{addedDays} días)</span>
            {!expired && <span className="block text-xs text-muted">Se suma a tus días restantes, no pierdes nada.</span>}
          </p>
        </div>

        {/* TODO(stripe): listar métodos guardados con `stripe.customers.listPaymentMethods` */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-sm">
          <span className="flex items-center gap-2 text-slate-300">
            <CreditCard className="h-4 w-4 text-neon-magenta" /> Visa •••• 4242
          </span>
          <button className="text-xs font-semibold text-neon-cyan hover:underline">Cambiar</button>
        </div>

        <Button fullWidth size="lg" className="mt-5" onClick={onRenew} loading={renewing}>
          {!renewing && <RefreshCcw className="h-5 w-5" />}
          {renewing ? "Renovando…" : `Renovar mi suscripción ahora · ${mxn(PLANS[renewPlan].price)}`}
        </Button>
      </div>
    </div>
  );
}
