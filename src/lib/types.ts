/**
 * Tipos de dominio de Angel Gym.
 * Mantén estos tipos sincronizados con el esquema de tu backend / base de datos
 * (p. ej. tablas `members`, `memberships`, `payments`).
 */

export type PlanId = "mensual" | "trimestral" | "semestral" | "anual";

export interface Plan {
  id: PlanId;
  name: string;
  shortName: string;
  months: number;
  /** Precio del periodo completo en MXN */
  price: number;
  /** Costo de inscripción en MXN (0 = bonificada) */
  enrollmentFee: number;
  /** Precio de referencia (sin promo) para mostrar el ahorro */
  regularPrice?: number;
  tagline: string;
  features: string[];
  badge?: string;
  highlighted?: boolean;
}

export type PaymentMethod = "card" | "spei" | "mercadopago";

export interface PersonalData {
  fullName: string;
  whatsapp: string;
  email: string;
  birthDate: string;
  emergencyName: string;
  emergencyPhone: string;
}

export interface MembershipPreferences {
  planId: PlanId;
  branchId: string;
  preferredShift: ShiftId;
  startDate: string; // ISO yyyy-mm-dd
}

export type ShiftId = "madrugada" | "manana" | "tarde" | "noche";

export interface PriceBreakdown {
  planPrice: number;
  enrollmentFee: number;
  subtotal: number;
  discounts: { label: string; amount: number }[];
  total: number;
}

export interface Member {
  id: string; // ID de socio, p. ej. AG-1024
  fullName: string;
  whatsapp: string;
  email?: string;
  planId: PlanId;
  branchId: string;
  startDate: string; // ISO
  endDate: string; // ISO
}

export interface PaymentResult {
  ok: boolean;
  transactionId: string;
  method: PaymentMethod;
  amount: number;
  message?: string;
}
