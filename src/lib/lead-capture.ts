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
  email: string;
  phone: string;
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

export async function sendLead(payload: LeadPayload): Promise<boolean> {
  const full: LeadPayload = {
    ...payload,
    page: payload.page ?? window.location.pathname,
    utm_source: payload.utm_source ?? (new URLSearchParams(window.location.search).get('utm_source') || ''),
  };
  const { source, city, budget_label, answers, name, ...rest } = full;
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
