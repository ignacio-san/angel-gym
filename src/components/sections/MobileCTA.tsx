"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Zap } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { GYM } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Barra CTA fija para móvil (mobile-first): aparece al pasar el Hero
 * para que inscribirse esté siempre a un toque de distancia.
 */
export function MobileCTA() {
  const { openRegistration, registrationOpen, renewalOpen } = useUI();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && !registrationOpen && !renewalOpen;

  return (
    <div
      className={cn(
        "safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/85 px-4 pt-3 backdrop-blur-xl transition-transform duration-300 sm:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex gap-2">
        <a
          href={`https://wa.me/${GYM.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <button
          onClick={() => openRegistration("trimestral")}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-neon-gradient text-sm font-black uppercase tracking-wider shadow-glow-purple active:scale-[.98]"
        >
          <Zap className="h-4 w-4" /> Inscribirme · 3 meses $900
        </button>
      </div>
    </div>
  );
}
