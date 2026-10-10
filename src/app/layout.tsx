import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angel Gym León | Disciplina hoy, resultados mañana",
  description:
    "Gimnasio de fuerza, pesas y acondicionamiento en León, Gto. Inscríbete en línea, renueva tu membresía y obtén tu credencial digital con QR.",
  keywords: ["gimnasio León", "Angel Gym", "gym León Guanajuato", "pesas", "membresía gimnasio"],
  openGraph: {
    title: "Angel Gym León",
    description: "Ponte en modo bestia. Promo trimestral: 3 meses por $900 MXN.",
    images: ["/images/hero.jpg"],
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
