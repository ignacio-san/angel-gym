import { Bath, Dumbbell, HeartPulse, QrCode, ShieldCheck, Trophy, UserCheck, Wifi } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const BENEFITS = [
  { icon: Dumbbell, title: "Peso libre sin límites", desc: "Racks, barras olímpicas y mancuernas hasta 50 kg." },
  { icon: UserCheck, title: "Coaches en piso", desc: "Te corrigen técnica y te arman tu rutina inicial sin costo." },
  { icon: HeartPulse, title: "Cardio completo", desc: "Caminadoras, bicis y escaladoras con iluminación neón." },
  { icon: QrCode, title: "Acceso con QR", desc: "Entra con tu credencial digital, sin tarjetas físicas." },
  { icon: Trophy, title: "Retos mensuales", desc: "Compite con la comunidad y gana meses gratis." },
  { icon: Bath, title: "Vestidores & regaderas", desc: "Limpios, con lockers y agua caliente." },
  { icon: Wifi, title: "Wi-Fi & música", desc: "Sistema de audio potente y Wi-Fi para tus playlists." },
  { icon: ShieldCheck, title: "Seguridad 24/7", desc: "Cámaras, estacionamiento vigilado y personal capacitado." },
];

export function Benefits() {
  return (
    <section id="beneficios" className="relative py-24 sm:py-32">
      <div className="bg-grid-pattern absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Beneficios"
          title={<>Todo para tu <span className="text-gradient">mejor versión</span></>}
          description="No solo es un gym: es tu comunidad, tu disciplina y tu energía diaria."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neon-purple/50 hover:shadow-glow-sm"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-neon-purple/0 blur-2xl transition group-hover:bg-neon-purple/30" />
              <div
                className={`mb-4 grid h-12 w-12 place-items-center rounded-xl border ${
                  i % 2 ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan" : "border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
