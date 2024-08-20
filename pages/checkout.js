import { useState } from 'react';
import { stripePromise } from '../stripe';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

export default function Checkout() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subscribe to Flashcard App</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
