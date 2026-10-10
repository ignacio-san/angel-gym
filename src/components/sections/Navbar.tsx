"use client";

import { useEffect, useState } from "react";
import { Menu, RefreshCcw, X, Zap } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useUI } from "@/context/UIContext";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { openRegistration, openRenewal } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Fondo glass al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: resalta el enlace de la sección visible
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b border-white/5 bg-ink-900/75 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Logo />

        {/* Links desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                  active === l.href ? "text-white" : "text-muted hover:text-white",
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-neon-gradient transition-transform duration-300",
                    active === l.href ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={openRenewal} className="hidden md:inline-flex">
            <RefreshCcw className="h-3.5 w-3.5" /> Mi Cuenta / Renovar
          </Button>
          <Button size="sm" onClick={() => openRegistration()} className="hidden sm:inline-flex">
            <Zap className="h-3.5 w-3.5" /> Inscribirme Hoy
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div className={cn("overflow-hidden transition-[max-height] duration-300 lg:hidden", open ? "max-h-[480px]" : "max-h-0")}>
        <div className="space-y-1 px-4 pb-6 pt-2">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-slate-200 hover:bg-white/5"
            >
              {l.label}
              <span className="h-1.5 w-1.5 rounded-full bg-neon-magenta" />
            </a>
          ))}
          <div className="grid gap-2 pt-3 sm:grid-cols-2">
            <Button variant="secondary" fullWidth onClick={() => { setOpen(false); openRenewal(); }}>
              <RefreshCcw className="h-4 w-4" /> Mi Cuenta / Renovar
            </Button>
            <Button fullWidth onClick={() => { setOpen(false); openRegistration(); }}>
              <Zap className="h-4 w-4" /> Inscribirme Hoy
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
