import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function CheckoutForm({ amount, onSuccess, onClose }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements) return

    setProcessing(true)
    
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      
      const { clientSecret } = await response.json()
      
      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      setError('An error occurred during payment')
    }
    
    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
        </button>
        
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-full hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
