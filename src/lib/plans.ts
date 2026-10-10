import type { Plan, PlanId, ShiftId } from "./types";

/**
 * Catálogo de planes.
 * TODO(backend): obtener desde `GET /api/plans` para que recepción pueda
 * actualizar precios/promos sin redeploy. Este arreglo sirve como fallback.
 */
export const ENROLLMENT_FEE = 250;

export const PLANS: Record<PlanId, Plan> = {
  mensual: {
    id: "mensual",
    name: "Pase Mensual Regular",
    shortName: "Mensual",
    months: 1,
    price: 450,
    enrollmentFee: ENROLLMENT_FEE,
    tagline: "Ideal para arrancar tu transformación.",
    features: [
      "Acceso total a peso libre y máquinas",
      "Zona de cardio completa",
      "Rutina inicial con coach de piso",
      "Credencial digital con QR",
    ],
  },
  trimestral: {
    id: "trimestral",
    name: "Plan Trimestral",
    shortName: "Trimestral",
    months: 3,
    price: 900,
    enrollmentFee: 0,
    regularPrice: 450 * 3 + ENROLLMENT_FEE,
    tagline: "Promo Bestia: 3 meses por $900. Cupo limitado.",
    badge: "Más Popular · Ahorro",
    highlighted: true,
    features: [
      "Todo lo del plan mensual",
      "Inscripción GRATIS",
      "Evaluación corporal (InBody) de inicio",
      "Plan de entrenamiento de fuerza 12 semanas",
      "Congelamiento de 7 días",
    ],
  },
  semestral: {
    id: "semestral",
    name: "Pase Semestral",
    shortName: "Semestral",
    months: 6,
    price: 1650,
    enrollmentFee: 0,
    regularPrice: 450 * 6 + ENROLLMENT_FEE,
    tagline: "Constancia que se nota.",
    features: [
      "Acceso libre todos los días",
      "Inscripción GRATIS",
      "2 evaluaciones corporales",
      "Locker asignado",
      "Congelamiento de 15 días",
    ],
  },
  anual: {
    id: "anual",
    name: "Pase Anual",
    shortName: "Anual",
    months: 12,
    price: 2900,
    enrollmentFee: 0,
    regularPrice: 450 * 12 + ENROLLMENT_FEE,
    tagline: "Modo bestia todo el año.",
    features: [
      "Acceso libre todos los días",
      "Inscripción GRATIS",
      "Evaluación corporal trimestral",
      "Locker + toalla incluida",
      "1 pase de invitado al mes",
      "Playera oficial Angel Gym",
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ["mensual", "trimestral", "semestral", "anual"];

/** Cupones de bienvenida (mock). TODO(backend): validar en `POST /api/coupons/validate`. */
export const COUPONS: Record<string, { label: string; percent: number }> = {
  BESTIA10: { label: "Cupón BESTIA10", percent: 10 },
  ANGEL5: { label: "Cupón ANGEL5", percent: 5 },
};

/** Descuento automático por inscribirse en línea */
export const ONLINE_WELCOME_DISCOUNT = 50;

export const SHIFTS: { id: ShiftId; label: string; range: string }[] = [
  { id: "madrugada", label: "Madrugada", range: "5:00 – 8:00" },
  { id: "manana", label: "Mañana", range: "8:00 – 13:00" },
  { id: "tarde", label: "Tarde", range: "13:00 – 18:00" },
  { id: "noche", label: "Noche", range: "18:00 – 23:00" },
];
