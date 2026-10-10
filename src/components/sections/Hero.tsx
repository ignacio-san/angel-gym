"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Dumbbell, Flame, Sparkles, Timer, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

const HEADLINES = [
  ["DISCIPLINA HOY,", "RESULTADOS MAÑANA"],
  ["PONTE EN", "MODO BESTIA"],
];

/** Cupo de la promo. TODO(backend): leer de `GET /api/promos/trimestral` → { total, taken }. */
const PROMO_TOTAL = 50;
const PROMO_TAKEN = 37;

function useCountdownToMonthEnd() {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = Math.max(0, end.getTime() - now.getTime());
      setLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff / 3_600_000) % 24),
        m: Math.floor((diff / 60_000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

export function Hero() {
  const { openRegistration } = useUI();
  const [idx, setIdx] = useState(0);
  const countdown = useCountdownToMonthEnd();
  const left = PROMO_TOTAL - PROMO_TAKEN;

  // Alterna los titulares cada 5s
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HEADLINES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 sm:pt-28">
      {/* Fondo: foto + overlays neón */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero.jpg" alt="" className="h-full w-full object-cover object-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/60 to-ink-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/70 to-transparent" />
        <div className="bg-grid-pattern absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-neon-purple/30 blur-[120px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-neon-cyan/20 blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:px-8">
        {/* Copy */}
        <div className="animate-fade-up">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-magenta/40 bg-neon-magenta/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-neon-magenta">
            <Flame className="h-3.5 w-3.5" /> León, Gto · Fuerza & Acondicionamiento
          </span>

          <h1 className="heading-display relative min-h-[1.8em] text-[3.6rem] sm:text-7xl md:text-8xl xl:text-[7.5rem]">
            {HEADLINES.map(([l1, l2], i) => (
              <span
                key={i}
                className={cn(
                  "block transition-all duration-700",
                  i === idx ? "relative opacity-100" : "pointer-events-none absolute inset-x-0 top-0 translate-y-4 opacity-0",
                )}
                aria-hidden={i !== idx}
              >
                <span className="block text-white">{l1}</span>
                <span className="text-gradient block bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_25px_rgba(176,38,255,.45)]">
                  {l2}
                </span>
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">
            Entrena fuerza real con peso libre, máquinas de poleas y acondicionamiento de alto nivel.
            Sin excusas, sin filas: <strong className="text-white">inscríbete en línea en menos de 3 minutos</strong> y
            entra con tu credencial digital.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openRegistration()} className="group">
              Comenzar Inscripción en Línea
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("planes")?.scrollIntoView()}>
              <Sparkles className="h-5 w-5 text-neon-cyan" /> Ver Promociones
            </Button>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            {[
              { icon: Users, value: "1,200+", label: "Socios activos" },
              { icon: Dumbbell, value: "80+", label: "Equipos" },
              { icon: Timer, value: "18h", label: "Abierto al día" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass rounded-2xl p-3 sm:p-4">
                <Icon className="mb-2 h-4 w-4 text-neon-cyan" />
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl tracking-wide sm:text-3xl">{value}</dd>
                <p className="text-[11px] text-muted sm:text-xs">{label}</p>
              </div>
            ))}
          </dl>
        </div>

        {/* Banner promoción destacada (interactivo) */}
        <div className="animate-fade-up [animation-delay:.15s]">
          <div className="neon-border group relative animate-float overflow-hidden rounded-3xl bg-ink-850/70 p-6 shadow-glow-purple backdrop-blur-2xl sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-neon-purple/40 blur-3xl transition-opacity group-hover:opacity-80" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-neon-gradient px-3 py-1 text-[11px] font-black uppercase tracking-widest">
                  Promo Trimestral
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                  </span>
                  Cupo limitado
                </span>
              </div>

              <p className="mt-6 font-display text-2xl tracking-wide text-muted">3 MESES POR</p>
              <p className="font-display text-8xl leading-none tracking-tight text-white drop-shadow-[0_0_30px_rgba(0,229,255,.35)]">
                $900<span className="ml-2 text-2xl text-neon-cyan">MXN</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                <span className="line-through">$1,600</span> · Inscripción <strong className="text-neon-cyan">GRATIS</strong> · Equivale a $300/mes
              </p>

              {/* Barra de cupo */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Lugares tomados</span>
                  <span className="text-neon-magenta">Quedan {left} de {PROMO_TOTAL}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-neon-gradient shadow-glow-sm"
                    style={{ width: `${(PROMO_TAKEN / PROMO_TOTAL) * 100}%` }}
                  />
                </div>
              </div>

              {/* Countdown */}
              <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                {(["d", "h", "m", "s"] as const).map((k) => (
                  <div key={k} className="rounded-xl border border-white/10 bg-ink-950/60 py-2">
                    <p className="font-display text-3xl tabular-nums">{countdown ? String(countdown[k]).padStart(2, "0") : "--"}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                      {{ d: "días", h: "hrs", m: "min", s: "seg" }[k]}
                    </p>
                  </div>
                ))}
              </div>

              <Button fullWidth size="lg" className="mt-6" onClick={() => openRegistration("trimestral")}>
                <Flame className="h-5 w-5" /> Apartar mi lugar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker inferior */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-white/5 bg-ink-950/70 py-3 backdrop-blur">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg tracking-[0.2em] text-slate-400">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {["Peso libre", "Poleas", "Cardio neón", "Powerlifting", "Hipertrofia", "Funcional", "Coaches certificados", "Credencial QR"].map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t} <span className="text-neon-magenta">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
