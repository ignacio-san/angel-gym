import { UIProvider } from "@/context/UIContext";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { RegistrationCTA } from "@/components/sections/RegistrationCTA";
import { Benefits } from "@/components/sections/Benefits";
import { Facilities } from "@/components/sections/Facilities";
import { Schedule } from "@/components/sections/Schedule";
import { Location } from "@/components/sections/Location";
import { Footer } from "@/components/sections/Footer";
import { MobileCTA } from "@/components/sections/MobileCTA";
import { RegistrationWizard } from "@/components/registration/RegistrationWizard";
import { RenewalPortal } from "@/components/renewal/RenewalPortal";

/**
 * Landing / SPA de Angel Gym.
 * Orden pensado para conversión: Hero → Planes → Registro → Beneficios →
 * Instalaciones → Horarios → Sucursal.
 */
export default function HomePage() {
  return (
    <UIProvider>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Pricing />
        <RegistrationCTA />
        <Benefits />
        <Facilities />
        <Schedule />
        <Location />
      </main>
      <Footer />
      <MobileCTA />

      {/* Modales globales */}
      <RegistrationWizard />
      <RenewalPortal />
    </UIProvider>
  );
}
