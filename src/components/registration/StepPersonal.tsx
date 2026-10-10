"use client";

import { useState } from "react";
import { ArrowRight, Calendar, HeartPulse, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import type { PersonalData } from "@/lib/types";
import { formatPhone, todayISO, validators } from "@/lib/utils";

interface StepPersonalProps {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  onNext: () => void;
}

type Key = keyof PersonalData;

const rules: Record<Key, (v: string) => string> = {
  fullName: validators.fullName,
  whatsapp: validators.phone,
  email: validators.email,
  birthDate: validators.birthDate,
  emergencyName: validators.required,
  emergencyPhone: validators.phone,
};

/** Paso 1 — Datos personales con validación en tiempo real (on blur) y al enviar. */
export function StepPersonal({ data, onChange, onNext }: StepPersonalProps) {
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errorOf = (k: Key) => (touched[k] || submitted ? rules[k](data[k]) : "");
  const isValid = (k: Key) => (touched[k] || submitted) && !rules[k](data[k]);

  const bind = (k: Key, format?: (v: string) => string) => ({
    name: k,
    value: data[k],
    error: errorOf(k),
    valid: isValid(k),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, [k]: format ? format(e.target.value) : e.target.value }),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const hasErrors = (Object.keys(rules) as Key[]).some((k) => rules[k](data[k]));
    if (!hasErrors) onNext();
    else {
      // Enfoca el primer campo con error (mejor UX en móvil)
      const first = (Object.keys(rules) as Key[]).find((k) => rules[k](data[k]));
      if (first) document.getElementsByName(first)[0]?.focus();
    }
  };

  return (
    <form onSubmit={submit} noValidate className="animate-fade-up space-y-5">
      <div>
        <h3 className="font-display text-3xl tracking-wide">Tus datos</h3>
        <p className="text-sm text-muted">Los usamos para tu credencial y para avisarte por WhatsApp antes de que venza tu plan.</p>
      </div>

      <Field label="Nombre completo" placeholder="Ej. Ángel Hernández" autoComplete="name" icon={<User className="h-4 w-4" />} {...bind("fullName")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="WhatsApp"
          type="tel"
          inputMode="numeric"
          placeholder="477 123 4567"
          autoComplete="tel-national"
          icon={<Phone className="h-4 w-4" />}
          hint="10 dígitos, sin lada internacional"
          {...bind("whatsapp", formatPhone)}
        />
        <Field
          label="Correo electrónico"
          type="email"
          inputMode="email"
          placeholder="tucorreo@gmail.com"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          {...bind("email")}
        />
      </div>

      <Field label="Fecha de nacimiento" type="date" max={todayISO()} icon={<Calendar className="h-4 w-4" />} {...bind("birthDate")} />

      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <legend className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-neon-magenta">
          <HeartPulse className="h-4 w-4" /> Contacto de emergencia
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" placeholder="Ej. María (mamá)" {...bind("emergencyName")} />
          <Field label="Teléfono" type="tel" inputMode="numeric" placeholder="477 765 4321" {...bind("emergencyPhone", formatPhone)} />
        </div>
      </fieldset>

      <Button type="submit" fullWidth size="lg">
        Continuar <ArrowRight className="h-5 w-5" />
      </Button>
    </form>
  );
}
