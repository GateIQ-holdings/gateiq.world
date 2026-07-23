const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const cors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
};

// Notify addresses — override with WAITLIST_NOTIFY="a@x.com,b@y.com" if needed.
const NOTIFY = (process.env.WAITLIST_NOTIFY || "tech@gateiq.world,joy@gateiq.world")
  .split(",").map((s) => s.trim()).filter(Boolean);
const FROM = process.env.WAITLIST_FROM || "Gate IQ Waitlist <waitlist@contact.gateiq.world>";

// Fire the team notification. Never throws — signup is already stored, so a
// mail failure must not fail the request. Skips silently if RESEND_API_KEY unset.
async function notify(fields) {
  if (!process.env.RESEND_API_KEY || NOTIFY.length === 0) return;
  const lines = Object.entries(fields).map(([k, v]) => `${k}: ${v || "—"}`).join("\n");
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM,
        to: NOTIFY,
        subject: `New founding signup: ${fields.name || fields.email}`,
        text: lines
      })
    });
    if (!r.ok) {
      console.error("Resend notify failed", r.status, await r.text().catch(() => ""));
    } else {
      console.log("Resend notify ok", r.status);
    }
  } catch (err) {
    console.error("Resend notify threw", err.message || err);
  }
}

module.exports = async function handler(req, res) {
  cors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe is not configured" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

  const email = String(body.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "Email is required" });

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const homeAirport = String(body.homeAirport || "").trim();
  const travelerType = String(body.travelerType || "").trim();
  const socials = String(body.socials || "").trim().slice(0, 500); // Stripe metadata value cap
  const smsOptIn = body.smsOptIn === "yes" ? "yes" : "no";
  const source = String(body.source || "prelaunch").trim();

  const metadata = { homeAirport, travelerType, socials, smsOptIn, source };

  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customer;

    if (existing.data.length > 0) {
      customer = await stripe.customers.update(existing.data[0].id, {
        name: name || undefined,
        phone: phone || undefined,
        metadata
      });
    } else {
      customer = await stripe.customers.create({
        email,
        name: name || undefined,
        phone: phone || undefined,
        metadata
      });
    }

    await notify({ name, email, phone, homeAirport, travelerType, socials, smsOptIn, source });

    return res.status(200).json({ ok: true, customerId: customer.id });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Could not save signup" });
  }
};
