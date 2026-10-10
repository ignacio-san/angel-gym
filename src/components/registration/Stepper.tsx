import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  current: number;
}

/** Indicador de progreso del wizard. Compacto en móvil, con etiquetas en desktop. */
export function Stepper({ steps, current }: StepperProps) {
  return (
    <div>
      <ol className="flex items-center gap-2" aria-label="Progreso de inscripción">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
              <div
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-black transition-all duration-500",
                  done && "border-transparent bg-neon-gradient text-white",
                  active && "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-glow-cyan",
                  !done && !active && "border-white/10 text-slate-500",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </div>
              <span className={cn("hidden text-xs font-semibold sm:block", active ? "text-white" : "text-slate-500")}>{label}</span>
              {i < steps.length - 1 && (
                <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className={cn("h-full bg-neon-gradient transition-all duration-700", done ? "w-full" : "w-0")} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs font-semibold text-neon-cyan sm:hidden">
        Paso {current + 1} de {steps.length} · <span className="text-white">{steps[current]}</span>
      </p>
    </div>
  );
}
