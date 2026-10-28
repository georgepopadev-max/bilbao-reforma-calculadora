/**
 * Envío y medición de leads — compartido por la calculadora (StepFinal)
 * y por los formularios de las landings y del blog (LeadForm).
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
  location?: string;
  page?: string;
  utm_source?: string;
}

export async function sendLead(payload: LeadPayload): Promise<boolean> {
  const body: LeadPayload = {
    ...payload,
    page: payload.page ?? window.location.pathname,
    utm_source: payload.utm_source ?? (new URLSearchParams(window.location.search).get('utm_source') || ''),
  };
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.ok) trackLead(body);
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
