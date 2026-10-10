"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Clock, Radio, TrendingDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WEEK_HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Curva de afluencia típica por hora (0–100).
 * TODO(backend): reemplazar por datos reales de torniquetes / check-ins QR:
 *   GET /api/occupancy → { current: number, capacity: number, hourly: number[] }
 *   Para tiempo real usar Server-Sent Events o WebSocket (p. ej. Supabase Realtime, Pusher).
 */
const WEEKDAY_CURVE = [0, 0, 0, 0, 0, 30, 55, 70, 50, 35, 28, 25, 30, 38, 34, 32, 45, 68, 90, 95, 82, 60, 38, 15];
const WEEKEND_CURVE = [0, 0, 0, 0, 0, 0, 0, 25, 45, 65, 75, 70, 55, 40, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function levelOf(v: number) {
  if (v < 40) return { label: "Poco concurrido ahora", short: "Tranquilo", color: "text-emerald-400", bar: "from-emerald-400 to-neon-cyan" };
  if (v < 72) return { label: "Concurrencia moderada", short: "Moderado", color: "text-neon-cyan", bar: "from-neon-cyan to-neon-purple" };
  return { label: "Hora pico", short: "Hora pico", color: "text-rose-400", bar: "from-neon-magenta to-rose-500" };
}

const fmtHour = (h: number) => `${h}:00`;

export function Schedule() {
  const [now, setNow] = useState<Date | null>(null);
  const [jitter, setJitter] = useState(0);

  // Reloj + variación aleatoria para simular datos en vivo (cada 5 s)
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => {
      setNow(new Date());
      setJitter(Math.round((Math.random() - 0.5) * 10));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const data = useMemo(() => {
    if (!now) return null;
    const day = now.getDay();
    const hour = now.getHours();
    const { open, close } = WEEK_HOURS[day];
    const curve = day === 0 || day === 6 ? WEEKEND_CURVE : WEEKDAY_CURVE;
    const isOpen = hour >= open && hour < close;
    const current = isOpen ? Math.min(100, Math.max(5, curve[hour] + jitter)) : 0;
    const hours = Array.from({ length: close - open }, (_, i) => open + i);
    const upcoming = hours.filter((h) => h > hour);
    const best = upcoming.length ? upcoming.reduce((a, b) => (curve[b] < curve[a] ? b : a)) : null;
    const minsToClose = isOpen ? (close - hour) * 60 - now.getMinutes() : 0;
    return { day, hour, open, close, curve, isOpen, current, hours, best, minsToClose };
  }, [now, jitter]);

  const level = levelOf(data?.current ?? 0);

  return (
    <section id="horarios" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Horarios & Afluencia"
          title={<>Entrena cuando <span className="text-gradient">quieras</span></>}
          description="Revisa en tiempo real qué tan lleno está el gym antes de salir de casa."
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Afluencia en vivo */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                <Radio className="h-4 w-4 text-rose-400" />
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-rose-500" />
                </span>
                En vivo
              </p>
              {data && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                    data.isOpen ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-500/15 text-rose-300",
                  )}
                >
                  {data.isOpen
                    ? `Abierto · cierra en ${Math.floor(data.minsToClose / 60)}h ${data.minsToClose % 60}m`
                    : `Cerrado · abre ${fmtHour(WEEK_HOURS[(data.hour >= data.close ? data.day + 1 : data.day) % 7].open)}`}
                </span>
              )}
            </div>

            <div className="mt-6 flex items-end gap-4">
              <p className={cn("font-display text-7xl leading-none tabular-nums", level.color)}>{data ? `${data.current}%` : "--"}</p>
              <div className="pb-1">
                <p className={cn("text-lg font-bold", level.color)}>{data?.isOpen ? level.label : "Gimnasio cerrado"}</p>
                <p className="text-xs text-muted">Capacidad ocupada · actualiza cada 5 s</p>
              </div>
            </div>

            {/* Barra de concurrencia */}
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/5">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", level.bar)}
                style={{ width: `${data?.current ?? 0}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <span>Tranquilo</span>
              <span>Moderado</span>
              <span>Hora pico</span>
            </div>

            {/* Gráfica por hora (estilo "horas populares") */}
            <div className="mt-8">
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                <Activity className="h-4 w-4 text-neon-cyan" /> Afluencia de hoy
              </p>
              <div className="no-scrollbar -mx-2 overflow-x-auto px-2">
                <div className="flex h-36 min-w-[420px] items-end gap-1.5">
                  {data?.hours.map((h) => {
                    const v = data.curve[h];
                    const isNow = h === data.hour;
                    return (
                      <div key={h} className="group flex flex-1 flex-col items-center gap-1.5">
                        <div className="relative flex h-28 w-full items-end">
                          <div
                            className={cn(
                              "w-full rounded-t-md transition-all duration-700",
                              isNow ? "bg-neon-gradient-v shadow-glow-purple" : h < data.hour ? "bg-white/10" : "bg-neon-purple/35 group-hover:bg-neon-purple/60",
                            )}
                            style={{ height: `${Math.max(6, isNow ? data.current : v)}%` }}
                          />
                          <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink-700 px-1.5 py-0.5 text-[10px] opacity-0 transition group-hover:opacity-100">
                            {levelOf(v).short}
                          </span>
                        </div>
                        <span className={cn("text-[10px] tabular-nums", isNow ? "font-bold text-neon-cyan" : "text-slate-500")}>{h}</span>
                      </div>
                    );
                  }) ?? <div className="h-28 w-full animate-pulse rounded-xl bg-white/5" />}
                </div>
              </div>
            </div>

            {data?.best != null && (
              <p className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-sm">
                <TrendingDown className="h-4 w-4 shrink-0 text-emerald-400" />
                Mejor hora para venir hoy: <strong className="text-emerald-300">{fmtHour(data.best)}</strong>
              </p>
            )}
          </div>

          {/* Horario semanal */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
              <Clock className="h-4 w-4 text-neon-magenta" /> Horario semanal
            </p>
            <ul className="space-y-1.5">
              {/* Lunes primero */}
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const w = WEEK_HOURS[d];
                const today = data?.day === d;
                return (
                  <li
                    key={d}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm transition",
                      today ? "neon-border bg-neon-purple/10 font-bold text-white" : "text-slate-300",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {w.day}
                      {today && <span className="rounded bg-neon-cyan/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-neon-cyan">Hoy</span>}
                    </span>
                    <span className="tabular-nums">
                      {fmtHour(w.open)} – {fmtHour(w.close)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-xs text-slate-500">Días festivos: horario especial publicado en Instagram.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
