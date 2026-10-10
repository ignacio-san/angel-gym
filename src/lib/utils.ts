import { COUPONS, ONLINE_WELCOME_DISCOUNT, PLANS } from "./plans";
import type { PlanId, PriceBreakdown } from "./types";

/** Concatena clases condicionalmente (mini `clsx`). */
export function cn(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

export const mxn = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

/* ---------------------------- Fechas ---------------------------- */

export const todayISO = () => toISO(new Date());

export function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addMonths(iso: string, months: number) {
  const d = parseISO(iso);
  d.setMonth(d.getMonth() + months);
  return toISO(d);
}

export function addDays(iso: string, days: number) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export function daysBetween(fromISO: string, toISOStr: string) {
  const ms = parseISO(toISOStr).getTime() - parseISO(fromISO).getTime();
  return Math.round(ms / 86_400_000);
}

export const formatDate = (iso: string) =>
  parseISO(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

/* --------------------------- Precios ---------------------------- */

/**
 * Calcula el desglose de costos.
 * ⚠️ IMPORTANTE: el backend SIEMPRE debe recalcular el total antes de crear el
 * PaymentIntent (Stripe) o la Preference (Mercado Pago). Nunca confíes en el
 * monto enviado por el cliente.
 */
export function calcBreakdown(planId: PlanId, couponCode?: string): PriceBreakdown {
  const plan = PLANS[planId];
  const enrollmentFee = plan.enrollmentFee;
  const subtotal = plan.price + enrollmentFee;
  const discounts: PriceBreakdown["discounts"] = [];

  // Bienvenida online solo aplica si el plan no trae ya inscripción gratis
  if (enrollmentFee > 0) {
    discounts.push({ label: "Bienvenida inscripción online", amount: ONLINE_WELCOME_DISCOUNT });
  }

  const coupon = couponCode ? COUPONS[couponCode.trim().toUpperCase()] : undefined;
  if (coupon) {
    const base = subtotal - discounts.reduce((a, d) => a + d.amount, 0);
    discounts.push({ label: `${coupon.label} (-${coupon.percent}%)`, amount: Math.round((base * coupon.percent) / 100) });
  }

  const total = Math.max(0, subtotal - discounts.reduce((a, d) => a + d.amount, 0));
  return { planPrice: plan.price, enrollmentFee, subtotal, discounts, total };
}

/* ------------------------- Validaciones -------------------------- */

export const validators = {
  required: (v: string) => (v.trim() ? "" : "Campo obligatorio"),
  fullName: (v: string) => (v.trim().split(/\s+/).length >= 2 ? "" : "Escribe nombre y apellido"),
  phone: (v: string) => (/^\d{10}$/.test(v.replace(/\D/g, "")) ? "" : "Debe tener 10 dígitos"),
  email: (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Correo no válido"),
  birthDate: (v: string) => {
    if (!v) return "Campo obligatorio";
    const age = daysBetween(v, todayISO()) / 365.25;
    if (age < 14) return "Edad mínima: 14 años (con tutor)";
    if (age > 100) return "Fecha no válida";
    return "";
  },
};

/** Formatea 4771234567 → 477 123 4567 */
export function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ");
}
