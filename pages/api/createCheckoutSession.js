import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Stripe from 'stripe';
import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '/Users/Ragini/Movies/Flashcard SaaS/Firebase/firebase.js'; // Ensure correct path

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firestore instance
const db = getFirestore(app);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { priceId } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId, // Ensure priceId is correct and corresponds to a valid price in Stripe
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      // Store the session in Firestore
      await setDoc(doc(db, 'checkout_sessions', session.id), {
        sessionId: session.id,
        created: session.created,
        status: session.status,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error('Error creating checkout session:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
