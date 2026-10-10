"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { PlanId } from "@/lib/types";

/**
 * Estado global de UI: controla los modales de Registro y Renovación
 * para que cualquier componente (Navbar, Hero, Pricing…) pueda abrirlos.
 */
interface UIContextValue {
  registrationOpen: boolean;
  selectedPlan: PlanId;
  openRegistration: (plan?: PlanId) => void;
  closeRegistration: () => void;
  renewalOpen: boolean;
  openRenewal: () => void;
  closeRenewal: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [renewalOpen, setRenewalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("trimestral");

  const openRegistration = useCallback((plan?: PlanId) => {
    if (plan) setSelectedPlan(plan);
    setRenewalOpen(false);
    setRegistrationOpen(true);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      registrationOpen,
      selectedPlan,
      openRegistration,
      closeRegistration: () => setRegistrationOpen(false),
      renewalOpen,
      openRenewal: () => {
        setRegistrationOpen(false);
        setRenewalOpen(true);
      },
      closeRenewal: () => setRenewalOpen(false),
    }),
    [registrationOpen, renewalOpen, selectedPlan, openRegistration],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return ctx;
}
