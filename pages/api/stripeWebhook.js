import { buffer } from 'micro';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Ensure that the rawBody is passed to the stripe webhook handler
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different Stripe event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Handle the event
        console.log(`Checkout session completed: ${session.id}`);
        // Optionally store session in Firestore or update subscription status
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        console.log(`Invoice payment succeeded: ${invoice.id}`);
        // Optionally store or update in Firestore
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        console.log(`Subscription deleted: ${subscription.id}`);
        // Optionally update Firestore with the subscription status
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
