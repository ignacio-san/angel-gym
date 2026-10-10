"use client";

import { ArrowRight, ClipboardList, CreditCard, QrCode, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useUI } from "@/context/UIContext";

const STEPS = [
  { icon: UserPlus, title: "Tus datos", desc: "Nombre, WhatsApp y contacto de emergencia." },
  { icon: ClipboardList, title: "Elige plan", desc: "Selecciona plan, horario y día de inicio." },
  { icon: CreditCard, title: "Paga seguro", desc: "Tarjeta, SPEI o Mercado Pago." },
  { icon: QrCode, title: "Credencial QR", desc: "Recíbela al instante y entra a entrenar." },
];

/** Sección "Registro": explica el flujo y lanza el wizard. */
export function RegistrationCTA() {
  const { openRegistration, openRenewal } = useUI();
  return (
    <section id="registro" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="neon-border relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-800 via-ink-850 to-ink-950 p-6 sm:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-neon-purple/30 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-neon-cyan/20 blur-[100px]" />

          <SectionHeading
            eyebrow="Registro en línea"
            title={<>Inscríbete en <span className="text-gradient">3 minutos</span></>}
            description="Sin filas ni papeleo. Desde tu celular, en 4 pasos."
            className="relative"
          />

          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="glass relative rounded-2xl p-5">
                <span className="absolute right-4 top-3 font-display text-5xl text-white/5">0{i + 1}</span>
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-neon-gradient shadow-glow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </li>
            ))}
          </ol>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openRegistration()} className="group w-full sm:w-auto">
              Comenzar Inscripción <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="secondary" onClick={openRenewal} className="w-full sm:w-auto">
              Ya soy socio · Renovar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
