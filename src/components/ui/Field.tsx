import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Muestra check verde cuando el campo es válido y fue tocado */
  valid?: boolean;
  icon?: ReactNode;
  hint?: string;
}

/** Input con label, ícono, validación visual (error / válido) y hint. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, valid, icon, hint, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
        {label}
      </label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={cn("field-input", icon && "pl-11", (error || valid) && "pr-10")}
          {...props}
        />
        {error ? (
          <AlertCircle className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
        ) : valid ? (
          <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
        ) : null}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});
