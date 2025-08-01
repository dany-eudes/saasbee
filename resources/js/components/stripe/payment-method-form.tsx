import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface PaymentMethodFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PaymentMethodForm({ onSuccess, onCancel }: PaymentMethodFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setError('Card element not found');
            setLoading(false);
            return;
        }

        try {
            // Create payment method with Stripe
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (stripeError) {
                setError(stripeError.message || 'An error occurred');
                setLoading(false);
                return;
            }

            if (!paymentMethod) {
                setError('Failed to create payment method');
                setLoading(false);
                return;
            }

            // Send payment method to backend
            router.post('/settings/billing/payment-method', {
                payment_method: paymentMethod.id,
            }, {
                onSuccess: () => {
                    onSuccess();
                },
                onError: (errors) => {
                    setError(errors.payment_method || 'Failed to save payment method');
                    setLoading(false);
                },
                onFinish: () => {
                    setLoading(false);
                }
            });

        } catch {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: false,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    Card Information
                </label>
                <div className="border rounded-md p-3 bg-background">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex gap-2">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={!stripe || loading}
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Saving...' : 'Save Payment Method'}
                </Button>
            </div>
        </form>
    );
}