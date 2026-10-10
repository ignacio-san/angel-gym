import { Instagram, MessageCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { GYM, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950 pb-28 pt-14 sm:pb-14">
      <div className="absolute inset-x-0 top-0 h-px bg-neon-gradient opacity-60" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            Disciplina hoy, resultados mañana. El gimnasio de fuerza y acondicionamiento más intenso de León, Gto.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={GYM.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="glass grid h-10 w-10 place-items-center rounded-xl hover:border-neon-magenta/60 hover:text-neon-magenta">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={`https://wa.me/${GYM.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="glass grid h-10 w-10 place-items-center rounded-xl hover:border-emerald-400/60 hover:text-emerald-300">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Navegación</p>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-slate-300 hover:text-neon-cyan">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Legal</p>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li><a href="#" className="hover:text-neon-cyan">Aviso de privacidad</a></li>
            <li><a href="#" className="hover:text-neon-cyan">Reglamento interno</a></li>
            <li><a href="#" className="hover:text-neon-cyan">Términos de membresía</a></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl px-4 text-xs text-slate-600 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Angel Gym León. Todos los derechos reservados.
      </p>
    </footer>
  );
}
