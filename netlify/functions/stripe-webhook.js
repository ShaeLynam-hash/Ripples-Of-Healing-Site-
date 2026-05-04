const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://indmbezacqesboecocvn.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const { type, data } = stripeEvent;

  // Checkout completed → trial started, card saved
  if (type === 'checkout.session.completed') {
    const session = data.object;
    const userId  = session.metadata?.supabase_user_id;
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        stripe_customer_id: session.customer,
        subscription_status: 'trialing',
      });
    }
  }

  // Subscription updated (trial ended → active, or cancelled, etc.)
  if (type === 'customer.subscription.updated' || type === 'customer.subscription.deleted') {
    const sub = data.object;
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', sub.customer)
      .maybeSingle();

    if (profile) {
      await supabase.from('profiles').update({
        subscription_status: sub.status, // 'active', 'canceled', 'past_due', etc.
      }).eq('id', profile.id);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
