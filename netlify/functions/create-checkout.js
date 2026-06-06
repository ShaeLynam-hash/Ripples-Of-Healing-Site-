const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin  = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const PRICE_ID   = 'price_1TSVrIHrFQYQ0zVjj0agwXkX';
const SITE_URL   = process.env.URL || 'https://ripplesofhealing.com';
const ALLOWED_ORIGINS = ['https://ripplesofhealing.com', 'https://www.ripplesofhealing.com'];

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

exports.handler = async (event) => {
  const origin = event.headers.origin || '';

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(origin), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Verify Firebase ID token
  const authHeader = event.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) {
    return { statusCode: 401, headers: corsHeaders(origin), body: 'Unauthorized' };
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch {
    return { statusCode: 401, headers: corsHeaders(origin), body: 'Invalid token' };
  }

  let email, userId;
  try {
    ({ email, userId } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: corsHeaders(origin), body: 'Invalid request body' };
  }

  // Ensure the token matches the userId being checked out
  if (!email || !userId || decoded.uid !== userId) {
    return { statusCode: 403, headers: corsHeaders(origin), body: 'Forbidden' };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { firebase_user_id: userId },
      },
      metadata: { firebase_user_id: userId },
      success_url: `${SITE_URL}/portal.html?checkout=success`,
      cancel_url:  `${SITE_URL}/pricing.html`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders(origin), body: JSON.stringify({ error: err.message }) };
  }
};
