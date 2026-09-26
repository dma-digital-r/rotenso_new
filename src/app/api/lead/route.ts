// Lead forms — "Zapytaj o wycenę" (product pages) and the investment form (Systemy RVF) —
// receive the form and pass it on.
// Where leads go is not decided yet: set LEAD_WEBHOOK_URL in .env.local (e.g. CRM or mail
// automation webhook) and each lead is POSTed there as JSON. Without it the form answers
// "not configured" instead of pretending the request was sent.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d][\d\s-]{7,}$/;
const POSTCODE = /^[\w\s-]{3,10}$/;
const NIP = /^[A-Z]{0,2}\d{8,12}$/i;

const text = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  // Honeypot: bots fill every field, people never see this one.
  if (text(body.website)) return Response.json({ ok: true });

  // "quote" = product pages (installer quote, needs a postcode); "investment" = Systemy RVF page
  // (company lead with NIP, investor or designer).
  const form = body.form === "investment" ? "investment" : "quote";
  const lead = {
    form,
    phone: text(body.phone, 30),
    email: text(body.email, 120),
    postcode: text(body.postcode, 10),
    nip: text(body.nip, 20),
    audience: text(body.audience, 30),
    contactTime: text(body.contactTime, 60),
    consent: body.consent === true,
    product: text(body.product, 120),
    page: text(body.page, 300),
    lang: text(body.lang, 5),
    sentAt: new Date().toISOString(),
  };
  const valid =
    PHONE.test(lead.phone) &&
    EMAIL.test(lead.email) &&
    lead.consent &&
    (form === "quote" ? POSTCODE.test(lead.postcode) : NIP.test(lead.nip.replace(/[\s-]/g, "")));
  if (!valid) return Response.json({ error: "invalid" }, { status: 400 });

  const target = process.env.LEAD_WEBHOOK_URL;
  if (!target) {
    console.warn("[formularz] LEAD_WEBHOOK_URL nie jest ustawiony — zgłoszenie nie zostało przekazane dalej");
    return Response.json({ error: "not-configured" }, { status: 503 });
  }
  const res = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) {
    console.error("[formularz] webhook odpowiedział", res.status);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
