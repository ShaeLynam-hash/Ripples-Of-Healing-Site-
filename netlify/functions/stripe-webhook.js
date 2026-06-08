const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin  = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}
const db = admin.firestore();

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const { type, data } = stripeEvent;

  if (type === 'checkout.session.completed') {
    const session = data.object;
    const userId  = session.metadata?.firebase_user_id;
    if (userId) {
      await db.collection('users').doc(userId).set({
        stripe_customer_id:  session.customer,
        subscription_status: 'trialing',
      }, { merge: true });
    }
  }

  if (type === 'customer.subscription.updated' || type === 'customer.subscription.deleted') {
    const sub  = data.object;
    const snap = await db.collection('users').where('stripe_customer_id', '==', sub.customer).limit(1).get();
    if (!snap.empty) {
      await snap.docs[0].ref.update({ subscription_status: sub.status });
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
