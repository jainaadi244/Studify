import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Loader2, CreditCard, Smartphone, ShieldCheck, Lock, ChevronLeft, Plus, Minus } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Event, PurchasedTicket } from '@/lib/types';
import { useApp } from '@/lib/AppContext';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

function StripePaymentForm({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const confirmPayment = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unknown error occurred');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await confirmPayment();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="p-6 bg-slate-50 dark:bg-slate-950/50 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Total to pay</span>
          <span className="font-bold text-2xl text-slate-900 dark:text-white">€{amount.toFixed(2)}</span>
        </div>
        
        <div className="mb-4">
          <ExpressCheckoutElement onConfirm={confirmPayment} />
        </div>
        
        <div className="relative py-4 flex items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">or pay with card</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>

        <PaymentElement />
        {errorMessage && <div className="text-red-500 text-sm mt-4 font-medium">{errorMessage}</div>}
      </div>
      <div className="p-6 pt-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
          {isProcessing ? 'Processing...' : `Pay €${amount.toFixed(2)}`}
        </button>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Secured by Stripe
        </div>
      </div>
    </form>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
  onSuccess: (tickets: PurchasedTicket[]) => void;
}

type CheckoutStep = 'summary' | 'payment' | 'processing' | 'success';
type PaymentMethod = 'card' | 'apple_pay' | 'google_pay';

export function CheckoutModal({ isOpen, event, onClose, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>('summary');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isFetchingSecret, setIsFetchingSecret] = useState(false);
  const { t } = useApp();

  const subtotal = event?.price ? event.price * quantity : 0;
  const platformFee = 0.00;
  const total = subtotal + platformFee;

  const handleContinueToPayment = async () => {
    if (!stripePromise) {
      // Fallback to mock flow if no keys are set
      setStep('payment');
      return;
    }

    setIsFetchingSecret(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep('payment');
      } else {
        console.error('Failed to create payment intent:', data.error);
        setStep('payment'); // Fallback to mock flow
      }
    } catch (e) {
      console.error(e);
      setStep('payment'); // Fallback to mock flow
    } finally {
      setIsFetchingSecret(false);
    }
  };

  const handlePurchase = () => {
    setStep('processing');
    
    // Simulate payment processing delay
    setTimeout(() => {
      setStep('success');
      
      // Simulate success state delay before closing
      setTimeout(() => {
        if (event) {
          // Generate tickets based on quantity
          const newTickets: PurchasedTicket[] = [];
          for (let i = 0; i < quantity; i++) {
            newTickets.push({
              id: Math.random().toString(36).substring(2, 10).toUpperCase() + i,
              event: event,
              purchaseDate: new Date().toISOString(),
              qrCode: `TICKET-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${event.id}-${i}`,
            });
          }
          onSuccess(newTickets);
        }
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    if (step !== 'processing') {
      onClose();
      // Reset state after animation completes
      setTimeout(() => {
        setStep('summary');
        setQuantity(1);
        setPaymentMethod('card');
        setClientSecret(null);
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && event && (
        <motion.div 
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
          onClick={handleClose}
        />
      )}
      {isOpen && event && (
        <div key="modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div 
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto flex flex-col"
          >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 relative flex items-center justify-center">
            {step === 'payment' && (
              <button 
                onClick={() => setStep('summary')}
                className="absolute left-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
              {step === 'summary' && 'Order Summary'}
              {step === 'payment' && 'Checkout'}
              {step === 'processing' && 'Processing'}
              {step === 'success' && 'Success'}
            </h2>
            {step !== 'processing' && step !== 'success' && (
              <button 
                onClick={handleClose}
                className="absolute right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Step 1: Summary */}
          {step === 'summary' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col"
            >
              <div className="p-6 bg-slate-50 dark:bg-slate-950/50">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{event.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{event.date}</p>
                
                <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Quantity</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>{quantity} × Ticket</span>
                    <span className="font-medium text-slate-900 dark:text-white">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Platform Fee</span>
                    <span className="font-medium text-slate-900 dark:text-white">€{platformFee.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white text-lg">Total</span>
                  <span className="font-bold text-2xl text-slate-900 dark:text-white">€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-6 pt-4">
                <button 
                  onClick={handleContinueToPayment}
                  disabled={isFetchingSecret}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center transition-all active:scale-95 shadow-sm disabled:opacity-50"
                >
                  {isFetchingSecret ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Payment'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              {clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <StripePaymentForm amount={total} onSuccess={handlePurchase} />
                </Elements>
              ) : (
                <>
                  <div className="p-6 bg-slate-50 dark:bg-slate-950/50">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Total to pay</span>
                      <span className="font-bold text-2xl text-slate-900 dark:text-white">€{total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <button 
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all border-2 ${
                          paymentMethod === 'apple_pay' 
                            ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                        Pay with Apple Pay
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('google_pay')}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all border-2 ${
                          paymentMethod === 'google_pay' 
                            ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                        Pay with Google Pay
                      </button>
                      
                      <div className="relative py-3 flex items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">or pay with card</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                      </div>

                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all border-2 ${
                          paymentMethod === 'card' 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Credit / Debit Card
                        </div>
                        <div className="flex gap-1">
                          <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                      </button>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Card Information</label>
                          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-slate-400" />
                              <input type="text" placeholder="Card number" className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                            </div>
                            <div className="flex">
                              <div className="w-1/2 px-4 py-3 border-r border-slate-200 dark:border-slate-700">
                                <input type="text" placeholder="MM / YY" className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                              </div>
                              <div className="w-1/2 px-4 py-3 flex items-center gap-2">
                                <input type="text" placeholder="CVC" className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
                                <Lock className="w-4 h-4 text-slate-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Name on Card</label>
                          <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={handlePurchase}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      Pay €{total.toFixed(2)}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Secured by Stripe (Mock Mode)
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center text-center"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Processing Payment</h3>
              <p className="text-slate-500 dark:text-slate-400">Please do not close this window...</p>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Your tickets have been added to your wallet.</p>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">Amount Paid</span>
                  <span className="font-bold text-slate-900 dark:text-white">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Tickets</span>
                  <span className="font-bold text-slate-900 dark:text-white">{quantity}x {event.title}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
