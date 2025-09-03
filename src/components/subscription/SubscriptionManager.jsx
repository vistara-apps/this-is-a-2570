import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, BarChart, Settings, ExternalLink } from 'lucide-react';
import { stripeService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const SubscriptionManager = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load subscription data
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const subscriptionData = await stripeService.getUserSubscription(user.id);
        setSubscription(subscriptionData);
      } catch (err) {
        console.error('Error loading subscription:', err);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };
    
    loadSubscription();
  }, [user]);

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!subscription || !subscription.customerId) {
        throw new Error('No active subscription found');
      }
      
      const { url } = await stripeService.createPortalSession(subscription.customerId);
      
      // Redirect to Stripe Customer Portal
      window.location.href = url;
    } catch (err) {
      console.error('Error creating portal session:', err);
      setError(err.message || 'Failed to open subscription management portal');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'canceled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'trialing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 w-full">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-6 w-full">
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-white bg-red-500/30 hover:bg-red-500/50 px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="glass-panel rounded-xl p-6 w-full">
        <div className="text-center">
          <h3 className="text-xl font-medium text-white mb-4">No Active Subscription</h3>
          <p className="text-white/70 mb-6">
            You don't have an active subscription. Upgrade to access premium features.
          </p>
          <button
            onClick={() => window.location.href = '/upgrade'}
            className="bg-accent hover:bg-accent/90 text-white font-medium rounded-lg py-2.5 px-5"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 w-full">
      <h2 className="text-xl font-semibold text-white mb-6">Your Subscription</h2>
      
      {/* Subscription Status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-white">{subscription.plan} Plan</h3>
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full border ${getStatusBadgeClass(subscription.status)}`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>
        <button
          onClick={handleManageSubscription}
          className="flex items-center bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2"
        >
          <Settings className="w-4 h-4 mr-2" />
          <span>Manage</span>
        </button>
      </div>
      
      {/* Subscription Details */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-accent mt-0.5 mr-3" />
            <div>
              <p className="text-white/70 text-sm">Current Period</p>
              <p className="text-white">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CreditCard className="w-5 h-5 text-accent mt-0.5 mr-3" />
            <div>
              <p className="text-white/70 text-sm">Payment Method</p>
              <p className="text-white">
                {subscription.paymentMethod ? (
                  `${subscription.paymentMethod.brand.toUpperCase()} •••• ${subscription.paymentMethod.last4}`
                ) : (
                  'Not available'
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <BarChart className="w-5 h-5 text-accent mt-0.5 mr-3" />
            <div>
              <p className="text-white/70 text-sm">Usage</p>
              <p className="text-white">
                {subscription.usageLimit === -1 ? 'Unlimited edits' : `${subscription.usageCount || 0}/${subscription.usageLimit} edits used`}
              </p>
            </div>
          </div>
          
          {subscription.cancelAt && (
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <p className="text-white/70 text-sm">Cancels On</p>
                <p className="text-red-400">{formatDate(subscription.cancelAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Subscription Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleManageSubscription}
          className="flex items-center bg-accent hover:bg-accent/90 text-white rounded-lg px-4 py-2"
        >
          <Settings className="w-4 h-4 mr-2" />
          <span>Billing Settings</span>
        </button>
        
        <button
          onClick={handleManageSubscription}
          className="flex items-center bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          <span>View Invoices</span>
        </button>
      </div>
    </div>
  );
};

export default SubscriptionManager;

