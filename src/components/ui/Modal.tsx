"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  className?: string;
  /** Evita cerrar con ESC/backdrop (p. ej. mientras se procesa un pago) */
  locked?: boolean;
}

/**
 * Modal accesible: full-screen en móvil (bottom sheet) y centrado en desktop.
 * Bloquea el scroll del body y cierra con ESC o clic en el backdrop.
 */
export function Modal({ open, onClose, children, title, className, locked }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !locked && onClose();
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, locked, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-md animate-fade-up [animation-duration:.2s]"
        onClick={() => !locked && onClose()}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "neon-border relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-ink-850/95 shadow-glow-purple outline-none backdrop-blur-2xl animate-scale-in sm:max-w-2xl sm:rounded-3xl",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-7">
          <div className="min-w-0 flex-1">{title}</div>
          <button
            onClick={onClose}
            disabled={locked}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:border-neon-magenta/60 hover:text-white disabled:opacity-30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">{children}</div>
      </div>
    </div>
  );
}
