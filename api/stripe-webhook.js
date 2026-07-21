const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.config = {
  api: { bodyParser: false }
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Stripe webhook is not configured" });
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  if (event.type === "setup_intent.succeeded") {
    const setupIntent = event.data.object;
    if (setupIntent.customer) {
      await stripe.customers.update(setupIntent.customer, {
        metadata: { card_saved: "true", card_saved_at: new Date().toISOString() }
      });
    }
  } else if (event.type === "setup_intent.setup_failed") {
    const setupIntent = event.data.object;
    if (setupIntent.customer) {
      await stripe.customers.update(setupIntent.customer, {
        metadata: { card_saved: "false" }
      });
    }
  }

  return res.status(200).json({ received: true });
};
