import { Instagram, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BRANCHES, GYM } from "@/lib/constants";

/**
 * Ubicación & contacto.
 * El mapa usa el embed público de Google Maps con un filtro CSS para darle
 * look dark-mode/neón. Para un estilo 100% personalizado, migrar a
 * Google Maps JS API (mapId con estilo dark) o Mapbox GL (style "dark-v11").
 */
export function Location() {
  const b = BRANCHES[0];
  const query = encodeURIComponent(`${b.address}, ${b.city}`);

  return (
    <section id="sucursal" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sucursal & Contacto"
          title={<>Encuéntranos en <span className="text-gradient">León</span></>}
          description="Fácil acceso, estacionamiento y la mejor vibra de la ciudad."
        />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Mapa estilizado */}
          <div className="neon-border relative min-h-[340px] overflow-hidden rounded-3xl bg-ink-950 sm:min-h-[440px]">
            <iframe
              title="Mapa Angel Gym León"
              src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
              className="absolute inset-0 h-full w-full [filter:invert(92%)_hue-rotate(200deg)_saturate(1.6)_brightness(.85)_contrast(1.1)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Tinte neón sobre el mapa */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neon-purple/25 via-transparent to-neon-cyan/15 mix-blend-color" />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(5,5,5,.9)]" />
            <div className="glass-strong absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl p-4 sm:right-auto">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon-gradient shadow-glow-purple">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold">{b.name}</p>
                <p className="truncate text-xs text-muted">{b.address}</p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Dirección</p>
              <p className="mt-1 text-lg font-semibold">{b.address}</p>
              <p className="text-muted">{b.city}</p>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-neon-cyan/60 bg-neon-cyan/10 py-3 text-sm font-bold uppercase tracking-wider text-neon-cyan transition hover:bg-neon-cyan/20 hover:shadow-glow-cyan"
            >
              <Navigation className="h-4 w-4" /> Cómo llegar
            </a>

            <div className="my-2 border-t border-white/5" />

            <ContactLink
              href={`https://wa.me/${GYM.whatsapp}?text=${encodeURIComponent("¡Hola Angel Gym! Quiero información 💪")}`}
              icon={<MessageCircle className="h-5 w-5" />}
              label="WhatsApp"
              value={GYM.whatsappDisplay}
              className="from-emerald-500/20 text-emerald-300"
            />
            <ContactLink
              href={GYM.instagramUrl}
              icon={<Instagram className="h-5 w-5" />}
              label="Instagram"
              value={`@${GYM.instagram}`}
              className="from-neon-magenta/20 text-neon-magenta"
            />
            <ContactLink href={`tel:+${GYM.whatsapp}`} icon={<Phone className="h-5 w-5" />} label="Llámanos" value={GYM.whatsappDisplay} className="from-neon-cyan/20 text-neon-cyan" />
            <ContactLink href={`mailto:${GYM.email}`} icon={<Mail className="h-5 w-5" />} label="Correo" value={GYM.email} className="from-neon-purple/20 text-neon-purple" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({ href, icon, label, value, className }: { href: string; icon: React.ReactNode; label: string; value: string; className: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/20 hover:bg-white/[0.05]"
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br to-transparent ${className}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
        <span className="block truncate font-semibold text-white transition group-hover:text-neon-cyan">{value}</span>
      </span>
    </a>
  );
}
