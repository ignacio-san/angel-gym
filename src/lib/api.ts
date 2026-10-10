/**
 * ============================================================================
 *  CAPA DE SERVICIOS (MOCK)
 * ============================================================================
 *  Toda la comunicación con el backend vive aquí. La UI solo llama a estas
 *  funciones, así que para integrar el backend real basta con reemplazar el
 *  cuerpo de cada función por un `fetch` a tu API (Next.js Route Handlers,
 *  Express, Supabase, Firebase, etc.).
 *
 *  Endpoints sugeridos:
 *    POST /api/members                 → registrar nuevo socio
 *    GET  /api/members/lookup?q=       → buscar por teléfono o ID de socio
 *    POST /api/payments/stripe/intent  → crear PaymentIntent (Stripe)
 *    POST /api/payments/mp/preference  → crear Preference (Mercado Pago)
 *    POST /api/payments/spei/reference → generar referencia SPEI (STP / Conekta / OpenPay)
 *    POST /api/memberships/renew       → renovar membresía
 *    GET  /api/occupancy               → afluencia en tiempo real (torniquetes / check-ins)
 *    POST /api/webhooks/stripe | /mp   → confirmar pagos (NUNCA confirmar solo desde el cliente)
 * ============================================================================
 */

import { PLANS } from "./plans";
import type {
  Member,
  MembershipPreferences,
  PaymentMethod,
  PaymentResult,
  PersonalData,
  PlanId,
} from "./types";
import { addDays, addMonths, calcBreakdown, todayISO } from "./utils";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const STORAGE_KEY = "angelgym.members.v1";

/* ------------------------------------------------------------------ */
/*  "Base de datos" local para la demo (localStorage + semillas)       */
/* ------------------------------------------------------------------ */

function seedMembers(): Member[] {
  const t = todayISO();
  return [
    {
      id: "AG-1024",
      fullName: "Carlos Ramírez",
      whatsapp: "4771234567",
      planId: "mensual",
      branchId: "leon-centro",
      startDate: addDays(t, -18),
      endDate: addDays(t, 12),
    },
    {
      id: "AG-2077",
      fullName: "Mariana López",
      whatsapp: "4779876543",
      planId: "trimestral",
      branchId: "leon-centro",
      startDate: addDays(t, -86),
      endDate: addDays(t, 4),
    },
    {
      id: "AG-0666",
      fullName: "Jorge “La Bestia” Torres",
      whatsapp: "4775550000",
      planId: "mensual",
      branchId: "leon-centro",
      startDate: addDays(t, -40),
      endDate: addDays(t, -10), // vencida
    },
  ];
}

function readDB(): Member[] {
  if (typeof window === "undefined") return seedMembers();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const extra: Member[] = raw ? JSON.parse(raw) : [];
    const seeds = seedMembers().filter((s) => !extra.some((e) => e.id === s.id));
    return [...extra, ...seeds];
  } catch {
    return seedMembers();
  }
}

function writeMember(member: Member) {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const list: Member[] = raw ? JSON.parse(raw) : [];
  const next = [member, ...list.filter((m) => m.id !== member.id)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function generateMemberId() {
  return `AG-${Math.floor(1000 + Math.random() * 9000)}`;
}

/* ------------------------------------------------------------------ */
/*  Pagos                                                              */
/* ------------------------------------------------------------------ */

export interface CardPayload {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

/**
 * Procesa el pago (mock).
 *
 * TODO(stripe):
 *   1. Backend: `stripe.paymentIntents.create({ amount: total*100, currency: "mxn", metadata })`
 *   2. Frontend: usar `@stripe/react-stripe-js` <PaymentElement/> en lugar de inputs propios
 *      (los datos de tarjeta NUNCA deben tocar tu servidor → PCI compliance).
 *   3. `stripe.confirmPayment({ elements, redirect: "if_required" })`
 *   4. Activar la membresía únicamente en el webhook `payment_intent.succeeded`.
 *
 * TODO(mercadopago):
 *   1. Backend: `new Preference(client).create({ items, back_urls, notification_url })`
 *   2. Frontend: redirigir a `init_point` o usar el Wallet Brick (@mercadopago/sdk-react).
 *   3. Activar membresía en el webhook `payment` con status `approved`.
 *
 * TODO(spei): generar CLABE/referencia única con tu proveedor y escuchar su webhook.
 */
export async function processPayment(params: {
  method: PaymentMethod;
  planId: PlanId;
  couponCode?: string;
  card?: CardPayload;
}): Promise<PaymentResult> {
  await sleep(1800);
  const { total } = calcBreakdown(params.planId, params.couponCode);

  // Simulación: tarjetas que terminan en 0002 son rechazadas (como en Stripe test mode)
  if (params.method === "card" && params.card?.number.replace(/\s/g, "").endsWith("0002")) {
    return { ok: false, transactionId: "", method: params.method, amount: total, message: "Tarjeta rechazada por el banco emisor." };
  }

  return {
    ok: true,
    transactionId: `${params.method.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    method: params.method,
    amount: total,
  };
}

/** Referencia SPEI simulada. TODO(spei): reemplazar por `POST /api/payments/spei/reference`. */
export function getSpeiReference(amount: number) {
  return {
    bank: "STP (Sistema de Transferencias y Pagos)",
    beneficiary: "ANGEL GYM LEON SA DE CV",
    clabe: "646180157000000004",
    reference: String(Math.floor(1000000 + Math.random() * 8999999)),
    amount,
  };
}

/* ------------------------------------------------------------------ */
/*  Socios                                                             */
/* ------------------------------------------------------------------ */

/** TODO(backend): `POST /api/members` → crea socio + membresía en estado `pending_payment`. */
export async function registerMember(personal: PersonalData, prefs: MembershipPreferences): Promise<Member> {
  await sleep(400);
  const member: Member = {
    id: generateMemberId(),
    fullName: personal.fullName.trim(),
    whatsapp: personal.whatsapp.replace(/\D/g, ""),
    email: personal.email,
    planId: prefs.planId,
    branchId: prefs.branchId,
    startDate: prefs.startDate,
    endDate: addMonths(prefs.startDate, PLANS[prefs.planId].months),
  };
  writeMember(member);
  return member;
}

/** TODO(backend): `GET /api/members/lookup?q=` (proteger con OTP por WhatsApp en producción). */
export async function lookupMember(query: string): Promise<Member | null> {
  await sleep(900);
  const q = query.trim().toUpperCase();
  const digits = q.replace(/\D/g, "");
  return (
    readDB().find(
      (m) => m.id.toUpperCase() === q || (digits.length === 10 && m.whatsapp === digits),
    ) ?? null
  );
}

/**
 * Calcula la nueva vigencia: si la membresía sigue activa se suma al final
 * actual (no se pierden días); si ya venció, corre desde hoy.
 */
export function computeRenewal(member: Member, planId: PlanId) {
  const t = todayISO();
  const base = member.endDate >= t ? member.endDate : t;
  return { from: base, newEndDate: addMonths(base, PLANS[planId].months) };
}

/** TODO(backend): `POST /api/memberships/renew` → cobra con método guardado (Stripe Customer / MP Card). */
export async function renewMembership(member: Member, planId: PlanId): Promise<Member> {
  await sleep(1600);
  const { newEndDate } = computeRenewal(member, planId);
  const updated: Member = {
    ...member,
    planId,
    startDate: member.endDate >= todayISO() ? member.startDate : todayISO(),
    endDate: newEndDate,
  };
  writeMember(updated);
  return updated;
}
