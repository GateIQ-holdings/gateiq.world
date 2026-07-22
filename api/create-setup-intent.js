const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const cors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
};

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
  const source = String(body.source || "prelaunch").trim();

  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customer;

    if (existing.data.length > 0) {
      customer = await stripe.customers.update(existing.data[0].id, {
        name: name || undefined,
        phone: phone || undefined,
        metadata: { homeAirport, travelerType, source }
      });
    } else {
      customer = await stripe.customers.create({
        email,
        name: name || undefined,
        phone: phone || undefined,
        metadata: { homeAirport, travelerType, source }
      });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card", "paypal"],
      metadata: {
        homeAirport,
        travelerType,
        source,
        founding_monthly_price: "49.99"
      }
    });

    return res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Could not create setup intent" });
  }
};
