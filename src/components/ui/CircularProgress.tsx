"use client";

import { useId, type ReactNode } from "react";

interface CircularProgressProps {
  /** 0 – 1 */
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  /** Cambia el gradiente a tonos de alerta cuando quedan pocos días */
  tone?: "neon" | "warning" | "danger";
}

const tones = {
  neon: ["#B026FF", "#00E5FF"],
  warning: ["#F59E0B", "#D946EF"],
  danger: ["#F43F5E", "#B026FF"],
};

/** Anillo de progreso SVG con gradiente y glow neón. */
export function CircularProgress({ value, size = 200, stroke = 14, children, tone = "neon" }: CircularProgressProps) {
  const id = useId().replace(/:/g, "");
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, value));
  const [from, to] = tones[tone];

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
          <filter id={`f-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#g-${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          filter={`url(#f-${id})`}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
