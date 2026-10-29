/**
 * Envío y medición de leads — compartido por la calculadora (StepFinal)
 * y por los formularios de las landings y del blog (LeadForm).
 *
 * El backend (lead-machine, POST /public/lead-capture) solo acepta
 * source "bilbao-reforma", la ciudad en minúsculas y las respuestas de la
 * calculadora dentro de breakdown_data. El formulario concreto viaja en
 * source_detail.
 */

const LEAD_ENDPOINT = 'https://api.axonflow.es/public/lead-capture';

export interface LeadPayload {
  /** Con email o teléfono basta: el formulario exige uno de los dos. */
  email?: string;
  phone?: string;
  source: string;
  calculator_type: string;
  city: string;
  consent: boolean;
  budget_min?: number | null;
  budget_max?: number | null;
  budget_label?: string;
  name?: string;
  location?: string;
  page?: string;
  utm_source?: string;
  /** Respuestas del usuario en la calculadora (m², calidad, estado…). */
  answers?: Record<string, unknown>;
}

/**
 * Valida el contacto del formulario. Basta con teléfono o email.
 * El teléfono se escribe como en España ("600 123 456"); se acepta también
 * con prefijo ("+34 600 123 456", "0034…") y se devuelve limpio para enviarlo.
 */
export function validateContact(
  emailRaw: string,
  phoneRaw: string,
): { ok: true; email?: string; phone?: string } | { ok: false; error: string; field: 'email' | 'phone' | 'both' } {
  const email = emailRaw.trim();
  const phone = phoneRaw.trim();

  if (!email && !phone) {
    return { ok: false, field: 'both', error: 'Déjanos un teléfono o un email para poder contactarte.' };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, field: 'email', error: 'Revisa el email: parece que le falta algo.' };
  }
  if (phone) {
    let p = phone.replace(/[().]/g, '').trim();
    if (p.startsWith('00')) p = '+' + p.slice(2);
    const digits = p.replace(/[\s-]/g, '');
    const spanish = /^[6-9]\d{8}$/.test(digits);
    const international = /^\+\d{8,15}$/.test(digits);
    if (!spanish && !international) {
      return { ok: false, field: 'phone', error: 'Revisa el teléfono: escríbelo con 9 cifras, por ejemplo 600 123 456.' };
    }
    return { ok: true, email: email || undefined, phone: spanish ? '+34' + digits : digits };
  }
  return { ok: true, email };
}

export async function sendLead(payload: LeadPayload): Promise<boolean> {
  const full: LeadPayload = {
    ...payload,
    page: payload.page ?? window.location.pathname,
    utm_source: payload.utm_source ?? (new URLSearchParams(window.location.search).get('utm_source') || ''),
  };
  const { source, city, budget_label, answers, name, email, phone, ...rest } = full;
  const breakdown = {
    ...(budget_label ? { budget_label } : {}),
    ...(answers ? { answers } : {}),
  };
  const body = {
    ...rest,
    source: 'bilbao-reforma',
    source_detail: source,
    city: city.toLowerCase(),
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(Object.keys(breakdown).length ? { breakdown_data: breakdown } : {}),
  };
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.ok) trackLead(full);
  return res.ok;
}

// GA4 solo existe si el usuario aceptó cookies; sin consentimiento no se mide.
function trackLead(payload: LeadPayload) {
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'generate_lead', {
    lead_source: payload.source,
    service_type: payload.calculator_type,
    city: payload.city,
    page_path: payload.page,
    value: payload.budget_max ?? undefined,
    currency: payload.budget_max ? 'EUR' : undefined,
  });
}
