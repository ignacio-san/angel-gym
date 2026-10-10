"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Stepper } from "./Stepper";
import { StepPersonal } from "./StepPersonal";
import { StepPlan } from "./StepPlan";
import { StepPayment } from "./StepPayment";
import { StepConfirmation } from "./StepConfirmation";
import { useUI } from "@/context/UIContext";
import { processPayment, registerMember, type CardPayload } from "@/lib/api";
import { BRANCHES } from "@/lib/constants";
import type { Member, MembershipPreferences, PaymentMethod, PaymentResult, PersonalData } from "@/lib/types";
import { todayISO } from "@/lib/utils";

const STEPS = ["Datos", "Plan", "Pago", "Credencial"];

const EMPTY_PERSONAL: PersonalData = {
  fullName: "",
  whatsapp: "",
  email: "",
  birthDate: "",
  emergencyName: "",
  emergencyPhone: "",
};

/**
 * Orquestador del flujo de inscripción (wizard de 4 pasos).
 * Conserva los datos si el usuario cierra el modal a medio camino
 * y se reinicia solo después de una inscripción exitosa.
 */
export function RegistrationWizard() {
  const { registrationOpen, closeRegistration, selectedPlan } = useUI();
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState<PersonalData>(EMPTY_PERSONAL);
  const [prefs, setPrefs] = useState<MembershipPreferences>({
    planId: selectedPlan,
    branchId: BRANCHES[0].id,
    preferredShift: "tarde",
    startDate: todayISO(),
  });
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<{ member: Member; payment: PaymentResult } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sincroniza el plan elegido desde las tarjetas de precios
  useEffect(() => {
    if (registrationOpen && !result) setPrefs((p) => ({ ...p, planId: selectedPlan }));
  }, [registrationOpen, selectedPlan, result]);

  const goTo = (n: number) => {
    setStep(n);
    setError(undefined);
    // Lleva al inicio del contenido del modal al cambiar de paso
    scrollRef.current?.closest(".overflow-y-auto")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = async (card?: CardPayload) => {
    setProcessing(true);
    setError(undefined);
    try {
      // 1) Cobro (TODO backend: crear intent/preference y confirmar vía webhook)
      const payment = await processPayment({ method, planId: prefs.planId, couponCode: coupon, card });
      if (!payment.ok) {
        setError(payment.message ?? "No pudimos procesar el pago. Intenta con otro método.");
        return;
      }
      // 2) Alta del socio (TODO backend: hacerlo en el webhook de pago aprobado)
      const member = await registerMember(personal, prefs);
      setResult({ member, payment });
      goTo(3);
    } catch {
      setError("Error de conexión. Revisa tu internet e inténtalo de nuevo.");
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = useCallback(() => {
    closeRegistration();
    if (result) {
      // Reinicia el wizard después de completar
      setTimeout(() => {
        setStep(0);
        setPersonal(EMPTY_PERSONAL);
        setCoupon("");
        setResult(null);
      }, 300);
    }
  }, [closeRegistration, result]);

  return (
    <Modal
      open={registrationOpen}
      onClose={handleClose}
      locked={processing}
      title={
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-display text-xl tracking-wider">
            <Zap className="h-4 w-4 text-neon-magenta" /> Inscripción en línea
          </p>
          <Stepper steps={STEPS} current={step} />
        </div>
      }
    >
      <div ref={scrollRef}>
        {step === 0 && <StepPersonal data={personal} onChange={setPersonal} onNext={() => goTo(1)} />}
        {step === 1 && <StepPlan prefs={prefs} onChange={setPrefs} onBack={() => goTo(0)} onNext={() => goTo(2)} />}
        {step === 2 && (
          <StepPayment
            planId={prefs.planId}
            coupon={coupon}
            onCouponChange={setCoupon}
            method={method}
            onMethodChange={(m) => {
              setMethod(m);
              setError(undefined);
            }}
            onBack={() => goTo(1)}
            onPay={handlePay}
            processing={processing}
            error={error}
          />
        )}
        {step === 3 && result && <StepConfirmation member={result.member} payment={result.payment} onClose={handleClose} />}
      </div>
    </Modal>
  );
}
