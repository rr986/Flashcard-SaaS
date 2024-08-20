import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId) => {
    setLoading(true);

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    const response = await fetch('/api/createCheckoutSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const { sessionId } = await response.json();
    await stripe.redirectToCheckout({ sessionId });

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pricing Plans</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-bold">Basic Plan - $10/month</h2>
          <button
            onClick={() => handleSubscribe('price_1JXS0SH7vEptzA')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            Subscribe
          </button>
        </div>
        <div className="p-4 border rounded">
          <h2 className="font-bold">Premium Plan - $20/month</h2>
          <button
            onClick={() => handleSubscribe('price_1JXS0TH7vEptzB')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
