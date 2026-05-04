const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_ID   = 'price_1TSVrIHrFQYQ0zVjj0agwXkX';
const SITE_URL   = process.env.URL || 'https://animated-sunburst-5a57db.netlify.app';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email, userId;
  try {
    ({ email, userId } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  if (!email || !userId) {
    return { statusCode: 400, body: 'Missing email or userId' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { supabase_user_id: userId },
      },
      metadata: { supabase_user_id: userId },
      success_url: `${SITE_URL}/portal.html?checkout=success`,
      cancel_url:  `${SITE_URL}/pricing.html`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
