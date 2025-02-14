import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  onPaymentSuccess: () => void;
  amount: number;
}

export function CheckoutForm({ onPaymentSuccess, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        setMessage(error.message || 'An unexpected error occurred.');
      } else {
        onPaymentSuccess();
      }
    } catch (err) {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
      {message && (
        <div className="text-red-500 text-sm text-center">{message}</div>
      )}
    </form>
  );
}