import React, { useState, useEffect } from 'react';
import { Check, Crown, Zap, X } from 'lucide-react';
import { stripeService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const PlanSelector = ({ onSelectPlan, onClose }) => {
  const { subscriptionTier } = useAuth();
  const [plans, setPlansPricing] = useState([
    {
      id: 'pro',
      name: 'Pro',
      price: '$15',
      period: '/month',
      icon: Zap,
      color: 'accent',
      features: [
        'Unlimited basic edits',
        'Advanced AI tools',
        'Background removal',
        'HD exports',
        'Priority support'
      ],
      priceId: stripeService.SUBSCRIPTION_PLANS.PRO
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$30',
      period: '/month',
      icon: Crown,
      color: 'yellow-400',
      popular: true,
      features: [
        'Everything in Pro',
        'AI upscaling',
        'Batch processing',
        '4K exports',
        'Commercial license',
        'API access'
      ],
      priceId: stripeService.SUBSCRIPTION_PLANS.PREMIUM
    }
  ]);

  // Load actual plans from Stripe
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const stripePlans = await stripeService.getSubscriptionPlans();
        
        if (stripePlans && stripePlans.length > 0) {
          // Update plans with actual pricing from Stripe
          const updatedPlans = plans.map(plan => {
            const stripePlan = stripePlans.find(sp => sp.id === plan.priceId);
            
            if (stripePlan) {
              return {
                ...plan,
                price: `$${(stripePlan.unit_amount / 100).toFixed(2)}`,
                priceId: stripePlan.id
              };
            }
            
            return plan;
          });
          
          setPlansPricing(updatedPlans);
        }
      } catch (error) {
        console.error('Error loading subscription plans:', error);
      }
    };

    loadPlans();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-xl max-w-2xl w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading text-white">Choose Your Plan</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-white/70 text-center mb-8">
          Unlock unlimited edits and advanced AI features to supercharge your image editing workflow.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative p-6 rounded-xl border-2 transition-all cursor-pointer hover:scale-105
                ${plan.popular 
                  ? 'border-yellow-400 bg-yellow-400/10' 
                  : 'border-white/20 bg-white/5 hover:border-accent'
                }
                ${subscriptionTier === plan.id ? 'border-green-400 bg-green-400/10' : ''}
              `}
              onClick={() => onSelectPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {subscriptionTier === plan.id && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${\n                  plan.color === 'accent' ? 'bg-accent/20' : 'bg-yellow-400/20'\n                }`}>
                  <plan.icon className={`w-8 h-8 ${\n                    plan.color === 'accent' ? 'text-accent' : 'text-yellow-400'\n                  }`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/70 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPlan(plan)}
                disabled={subscriptionTier === plan.id}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium transition-colors
                  ${subscriptionTier === plan.id 
                    ? 'bg-green-400/20 text-green-400 cursor-not-allowed' 
                    : plan.popular 
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-black' 
                      : 'bg-accent hover:bg-accent/90 text-white'
                  }
                `}
              >
                {subscriptionTier === plan.id ? 'Current Plan' : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/50 text-sm">
            Cancel anytime • 14-day money-back guarantee • Secure payment with Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelector;

