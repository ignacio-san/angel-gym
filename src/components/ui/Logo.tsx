import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Imagotipo de Angel Gym (SVG vectorial).
 * Silueta atlética en pose de doble bíceps con peinado/corona característico,
 * trazo blanco con halo neón. Si tienes el logo oficial en SVG, reemplaza
 * <LogoMark/> por <img src="/logo.svg" />.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B026FF" />
          <stop offset=".5" stopColor="#D946EF" />
          <stop offset="1" stopColor="#00E5FF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="16" fill="#0A0A0C" stroke={`url(#lg-${id})`} strokeWidth="1.5" />
      <g stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Corona / peinado */}
        <path d="M25 17 L26.5 9 L29.5 13.5 L32 7 L34.5 13.5 L37.5 9 L39 17" stroke={`url(#lg-${id})`} />
        {/* Cabeza */}
        <path d="M26 18.5c0 4.5 2.7 8 6 8s6-3.5 6-8" />
        {/* Cuello y trapecios */}
        <path d="M29 26.5 28.5 29 M35 26.5l.5 2.5" />
        <path d="M17 32c5-3 10-3.5 15-3.5s10 .5 15 3.5" />
        {/* Brazo izquierdo: doble bíceps */}
        <path d="M17 32 9 34.5c-2 .4-3-1-2.6-2.8L9.5 21" />
        <path d="M9.6 25.5c3.5-1.5 6.5.2 7.4 4.5" />
        <path d="M8 21.5c.3-1.6 2.6-1.8 3.2-.2" />
        {/* Brazo derecho: doble bíceps */}
        <path d="M47 32l8 2.5c2 .4 3-1 2.6-2.8L54.5 21" />
        <path d="M54.4 25.5c-3.5-1.5-6.5.2-7.4 4.5" />
        <path d="M56 21.5c-.3-1.6-2.6-1.8-3.2-.2" />
        {/* Torso en V */}
        <path d="M20 33.5 25.5 55 M44 33.5 38.5 55 M25.5 55h13" />
        {/* Pectorales y abdomen */}
        <path d="M24 40c2.5 2 5.3 2.6 8 1 2.7 1.6 5.5 1 8-1" stroke={`url(#lg-${id})`} />
        <path d="M32 43v10 M28.5 46.5h7 M29 50.5h6" strokeWidth="1.6" opacity=".8" />
      </g>
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <a href="#inicio" className={cn("group flex items-center gap-2.5", className)} aria-label="Angel Gym — inicio">
      <LogoMark className="h-10 w-10 shrink-0 animate-glow-pulse transition-transform group-hover:scale-105 sm:h-11 sm:w-11" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-sans text-xl font-black italic tracking-tight text-white sm:text-2xl">
            Angel<span className="text-gradient">.</span>
          </span>
          <span className="font-display text-sm tracking-[0.45em] text-neon-cyan">GYM LEÓN</span>
        </span>
      )}
    </a>
  );
}
