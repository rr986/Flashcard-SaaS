import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_live_yourPublishableKeyHere");

export default function Checkout() {
  const [priceId, setPriceId] = useState("YOUR_STRIPE_PRICE_ID");

  async function handleSubscribe() {
    try {
      // Call our new API route
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await res.json();
      if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subscribe to Flashcard App</h1>
      <Elements stripe={stripePromise}>
      </Elements>
      <button
        onClick={handleSubscribe}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Checkout
      </button>
    </div>
  );
}
