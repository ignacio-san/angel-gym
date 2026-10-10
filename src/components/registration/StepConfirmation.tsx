"use client";

import { CheckCircle2, Download, MessageCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DigitalMembershipCard } from "@/components/membership/DigitalMembershipCard";
import { GYM } from "@/lib/constants";
import type { Member, PaymentResult } from "@/lib/types";
import { formatDate, mxn } from "@/lib/utils";

interface StepConfirmationProps {
  member: Member;
  payment: PaymentResult;
  onClose: () => void;
}

/** Paso 4 — Éxito + credencial digital con QR. */
export function StepConfirmation({ member, payment, onClose }: StepConfirmationProps) {
  const firstName = member.fullName.split(" ")[0];
  const waText = encodeURIComponent(
    `¡Hola Angel Gym! Ya soy socio 💪\nID: ${member.id}\nNombre: ${member.fullName}\nVigencia: ${formatDate(member.startDate)} – ${formatDate(member.endDate)}`,
  );

  return (
    <div className="animate-fade-up space-y-7 text-center">
      <div>
        <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
          <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-neon-cyan shadow-glow-cyan">
            <CheckCircle2 className="h-8 w-8 text-ink-900" strokeWidth={2.5} />
          </span>
        </div>
        <h3 className="heading-display text-5xl">
          ¡Bienvenido a la <span className="text-gradient">manada</span>, {firstName}!
        </h3>
        <p className="mt-2 text-sm text-muted">
          {payment.method === "spei"
            ? "Registramos tu transferencia. Tu credencial queda activa en cuanto se confirme el depósito."
            : `Pago de ${mxn(payment.amount)} confirmado.`}{" "}
          Folio <span className="font-mono text-slate-300">{payment.transactionId}</span>
        </p>
      </div>

      <DigitalMembershipCard member={member} />

      <div className="grid gap-3 sm:grid-cols-2">
        {/* TODO(backend): generar PDF/PNG en el servidor o pase de Apple Wallet (.pkpass) / Google Wallet. */}
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="h-4 w-4" /> Guardar credencial
        </Button>
        <a
          href={`https://wa.me/${GYM.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-400/10 px-5 text-sm font-bold uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-400/20"
        >
          <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
        </a>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm text-muted">
        <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-neon-cyan" />
        <p>
          Toma captura o guarda esta credencial. En recepción solo escanea tu QR. Te enviaremos un recordatorio por WhatsApp
          3 días antes de que venza tu plan.
        </p>
      </div>

      <Button fullWidth size="lg" onClick={onClose}>
        ¡Listo, a entrenar!
      </Button>
    </div>
  );
}
