"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** TODO(cms): administrar fotos desde un CMS (Sanity, Contentful) o Cloudinary. */
const AREAS = [
  {
    id: "muscle",
    title: "Muscle & Fitness",
    tag: "Fuerza",
    desc: "Racks de potencia, plataformas y barras olímpicas para sentadilla, banca y peso muerto.",
    img: "/images/muscle-fitness.jpg",
  },
  {
    id: "free",
    title: "Peso Libre",
    tag: "Hipertrofia",
    desc: "Mancuernas de 2.5 a 50 kg, bancos ajustables y espejos de pared completa.",
    img: "/images/free-weights.jpg",
  },
  {
    id: "cables",
    title: "Poleas & Máquinas",
    tag: "Aislamiento",
    desc: "Crossover, jalones, remos y estaciones selectorizadas para cada grupo muscular.",
    img: "/images/cables.jpg",
  },
  {
    id: "cardio",
    title: "Cardio Neón",
    tag: "Acondicionamiento",
    desc: "Caminadoras, bicicletas y escaladoras con pantallas, iluminadas con neón.",
    img: "/images/cardio.jpg",
  },
];

/** Galería de instalaciones: grid en desktop, carrusel con swipe en móvil. */
export function Facilities() {
  const [active, setActive] = useState(0);
  const a = AREAS[active];
  const go = (d: number) => setActive((i) => (i + d + AREAS.length) % AREAS.length);

  return (
    <section id="instalaciones" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute -left-40 top-1/3 -z-10 h-96 w-96 rounded-full bg-neon-purple/20 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Instalaciones & Maquinaria"
          title={<>Tu nueva <span className="text-gradient">zona de guerra</span></>}
          description="Más de 80 equipos profesionales en un espacio diseñado para que entrenes con la máxima energía."
        />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Visor principal */}
          <div className="neon-border group relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-auto lg:min-h-[520px]">
            {AREAS.map((ar, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={ar.id}
                src={ar.img}
                alt={ar.title}
                loading="lazy"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-all duration-700",
                  i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-neon-cyan backdrop-blur">
                {a.tag}
              </span>
              <h3 className="heading-display mt-3 text-5xl sm:text-6xl">{a.title}</h3>
              <p className="mt-2 max-w-md text-sm text-slate-300">{a.desc}</p>
            </div>
            <div className="absolute right-4 top-4 flex gap-2">
              <button onClick={() => go(-1)} aria-label="Anterior" className="glass grid h-10 w-10 place-items-center rounded-full hover:border-neon-purple/60">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => go(1)} aria-label="Siguiente" className="glass grid h-10 w-10 place-items-center rounded-full hover:border-neon-purple/60">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute left-6 top-6 flex gap-1.5">
              {AREAS.map((ar, i) => (
                <span key={ar.id} className={cn("h-1 rounded-full transition-all", i === active ? "w-8 bg-neon-cyan" : "w-3 bg-white/30")} />
              ))}
            </div>
          </div>

          {/* Miniaturas / selector */}
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {AREAS.map((ar, i) => (
              <button
                key={ar.id}
                onClick={() => setActive(i)}
                className={cn(
                  "group relative flex w-64 shrink-0 snap-start items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition-all lg:w-full",
                  i === active ? "border-neon-purple/70 bg-neon-purple/10 shadow-glow-sm" : "border-white/10 bg-white/[0.02] hover:border-white/25",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ar.img} alt="" loading="lazy" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl tracking-wide">{ar.title}</span>
                  <span className="block truncate text-xs text-muted">{ar.tag}</span>
                </span>
                <Expand className={cn("h-4 w-4 shrink-0 transition", i === active ? "text-neon-cyan" : "text-slate-600")} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
