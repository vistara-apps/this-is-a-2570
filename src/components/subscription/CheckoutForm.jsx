import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { stripeService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const CheckoutForm = ({ selectedPlan, onBack, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to subscribe');
      return;
    }
    
    if (!selectedPlan) {
      setError('No plan selected');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create a checkout session with Stripe
      const { sessionId, url } = await stripeService.createCheckoutSession(
        selectedPlan.priceId,
        user.id,
        user.email
      );
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
      
      // Note: The user will be redirected to Stripe's checkout page,
      // so the following code may not execute
      
      if (onSuccess) {
        onSuccess(sessionId);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 w-full max-w-md mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-white/70 hover:text-white mb-4 focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Plans</span>
      </button>
      
      <h2 className="text-heading text-white text-center mb-6">Complete Your Subscription</h2>
      
      {/* Plan Summary */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Plan:</span>
          <span className="text-white font-medium">{selectedPlan.name}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Price:</span>
          <span className="text-white font-medium">{selectedPlan.price}{selectedPlan.period}</span>
        </div>
        <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
          <span className="text-white/70">Total:</span>
          <span className="text-white font-medium">{selectedPlan.price}</span>
        </div>
      </div>
      
      {/* Checkout Form */}
      <form onSubmit={handleCheckout} className="space-y-4">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center text-white mb-2">
            <CreditCard className="h-5 w-5 mr-2" />
            <span className="font-medium">Payment Information</span>
          </div>
          <p className="text-white/70 text-sm">
            You will be redirected to Stripe's secure payment page to complete your subscription.
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        
        {/* Security note */}
        <div className="flex items-center justify-center text-white/50 text-sm">
          <Lock className="h-4 w-4 mr-1" />
          <span>Secure payment processed by Stripe</span>
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-white font-medium rounded-lg py-3 px-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              <span>Processing...</span>
            </div>
          ) : (
            'Proceed to Payment'
          )}
        </button>
        
        {/* Terms and conditions */}
        <p className="text-center text-white/50 text-xs">
          By proceeding, you agree to our Terms of Service and acknowledge that your subscription will automatically renew unless canceled.
        </p>
      </form>
    </div>
  );
};

export default CheckoutForm;

