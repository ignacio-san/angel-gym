"use client";

import { QRCodeSVG } from "qrcode.react";
import { LogoMark } from "@/components/ui/Logo";
import { PLANS } from "@/lib/plans";
import type { Member } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/**
 * Credencial digital de socio con QR de acceso.
 *
 * TODO(backend): el QR NO debe contener datos sensibles ni ser estático.
 * Recomendado: un token firmado de corta duración (JWT/HMAC) generado por
 * `GET /api/members/:id/access-token`, que el lector de recepción valida
 * contra el servidor. Aquí se codifica un payload de demostración.
 */
export function DigitalMembershipCard({ member }: { member: Member }) {
  const plan = PLANS[member.planId];
  const qrValue = `ANGELGYM:${member.id}:${member.endDate}`;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-4 rounded-[2rem] bg-neon-gradient opacity-40 blur-2xl" />
      <div className="neon-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-5">
        {/* Brillo holográfico */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon-purple/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-neon-cyan/25 blur-3xl" />
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-9 w-9" />
            <div className="leading-none">
              <p className="text-base font-black italic">Angel Gym</p>
              <p className="font-display text-[11px] tracking-[0.35em] text-neon-cyan">MEMBER PASS</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Activa
          </span>
        </div>

        <div className="relative mt-5 flex gap-4">
          {/* QR con línea de escaneo */}
          <div className="relative shrink-0 overflow-hidden rounded-2xl bg-white p-2.5 shadow-glow-cyan">
            <QRCodeSVG value={qrValue} size={112} bgColor="#FFFFFF" fgColor="#0A0A0C" level="M" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-full animate-scan">
              <div className="h-0.5 w-full bg-neon-cyan shadow-[0_0_12px_#00E5FF]" />
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2.5 text-xs">
            <Info label="Socio" value={member.fullName} big />
            <Info label="ID" value={member.id} mono />
            <Info label="Plan" value={plan.shortName} />
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs">
          <Info label="Inicio" value={formatDate(member.startDate)} />
          <Info label="Vigente hasta" value={formatDate(member.endDate)} accent />
        </div>

        <p className="relative mt-4 text-center text-[10px] uppercase tracking-[0.25em] text-slate-500">
          Muestra este código en recepción
        </p>
      </div>
    </div>
  );
}

function Info({ label, value, big, mono, accent }: { label: string; value: string; big?: boolean; mono?: boolean; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p
        className={[
          "truncate font-semibold",
          big ? "text-sm text-white" : "text-slate-200",
          mono ? "font-mono tracking-wider text-neon-cyan" : "",
          accent ? "text-neon-magenta" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
