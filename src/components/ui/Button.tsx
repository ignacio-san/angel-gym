import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-neon-gradient bg-[length:200%_100%] text-white shadow-glow-purple hover:bg-right hover:shadow-glow-cyan",
  secondary:
    "border border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-glow-cyan",
  outline: "border border-white/15 bg-white/5 text-white hover:border-neon-purple/60 hover:bg-white/10",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

/** Botón base reutilizable con variantes neón y estado de carga. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
