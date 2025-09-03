import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { stripeService } from '../services';

/**
 * Custom hook for subscription management
 * 
 * @returns {Object} Subscription methods and state
 */
const useSubscription = () => {
  const { user, subscriptionTier } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
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

  /**
   * Create a checkout session for a subscription
   * 
   * @param {Object} plan - The plan to subscribe to
   * @returns {Promise<Object>} - Promise resolving to the checkout session
   */
  const createCheckoutSession = useCallback(async (plan) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    if (!plan || !plan.priceId) {
      throw new Error('Invalid plan selected');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const session = await stripeService.createCheckoutSession(
        plan.priceId,
        user.id,
        user.email
      );
      
      return session;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err.message || 'Failed to create checkout session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Create a customer portal session
   * 
   * @returns {Promise<Object>} - Promise resolving to the portal session
   */
  const createPortalSession = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    if (!subscription || !subscription.customerId) {
      throw new Error('No active subscription found');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const session = await stripeService.createPortalSession(subscription.customerId);
      
      return session;
    } catch (err) {
      console.error('Error creating portal session:', err);
      setError(err.message || 'Failed to create portal session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, subscription]);

  /**
   * Check if a feature is available for the current subscription tier
   * 
   * @param {string} featureType - The type of feature to check
   * @returns {boolean} - Whether the feature is available
   */
  const isFeatureAvailable = useCallback((featureType) => {
    // Features that require pro or premium tier
    const proFeatures = ['artisticFilters', 'aiUpscale', 'batchProcessing', '4kExport'];
    
    // Features that require premium tier
    const premiumFeatures = ['aiUpscale', 'batchProcessing', '4kExport'];
    
    if (premiumFeatures.includes(featureType) && subscriptionTier !== 'premium') {
      return false;
    }
    
    if (proFeatures.includes(featureType) && subscriptionTier === 'free') {
      return false;
    }
    
    return true;
  }, [subscriptionTier]);

  /**
   * Get the maximum number of edits allowed for the current subscription tier
   * 
   * @returns {number} - Maximum number of edits (-1 for unlimited)
   */
  const getEditLimit = useCallback(() => {
    switch (subscriptionTier) {
      case 'premium':
      case 'pro':
        return -1; // Unlimited
      case 'free':
      default:
        return 5;
    }
  }, [subscriptionTier]);

  /**
   * Format a subscription status for display
   * 
   * @param {string} status - The subscription status
   * @returns {string} - Formatted status
   */
  const formatStatus = useCallback((status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'canceled':
        return 'Canceled';
      case 'past_due':
        return 'Past Due';
      case 'unpaid':
        return 'Unpaid';
      case 'trialing':
        return 'Trial';
      case 'incomplete':
        return 'Incomplete';
      case 'incomplete_expired':
        return 'Expired';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }, []);

  return {
    subscription,
    loading,
    error,
    createCheckoutSession,
    createPortalSession,
    isFeatureAvailable,
    getEditLimit,
    formatStatus,
    isSubscribed: !!subscription && subscription.status === 'active',
    isPro: subscriptionTier === 'pro' || subscriptionTier === 'premium',
    isPremium: subscriptionTier === 'premium'
  };
};

export default useSubscription;

