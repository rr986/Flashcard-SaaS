import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      "{CLIENT_SECRET}", // Replace with your client secret from backend
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      setError(error.message);
    } else {
      console.log(paymentIntent);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
