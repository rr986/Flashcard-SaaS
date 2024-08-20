import { loadStripe } from '@stripe/stripe-js';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { stripe } from '../../stripe';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { priceId } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      // Optionally, you can store the session in Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'checkout_sessions', session.id), {
        sessionId: session.id,
        created: session.created,
        status: session.status,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
