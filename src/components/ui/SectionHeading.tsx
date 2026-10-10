import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Encabezado de sección consistente (eyebrow + título display + descripción). */
export function SectionHeading({ eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 md:mb-14", align === "center" && "mx-auto max-w-2xl text-center", className)}>
      <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-neon-cyan">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
        {eyebrow}
      </span>
      <h2 className="heading-display text-5xl text-white sm:text-6xl md:text-7xl">{title}</h2>
      {description && <p className="mt-4 text-base text-muted md:text-lg">{description}</p>}
    </div>
  );
}
