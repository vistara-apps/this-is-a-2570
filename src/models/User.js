/**
 * User Model
 * 
 * Represents a user in the application.
 * This model corresponds to the 'profiles' table in Supabase.
 */

/**
 * User class representing a user in the application
 */
class User {
  /**
   * Create a new User instance
   * 
   * @param {Object} userData - User data from Supabase
   * @param {string} userData.userId - Unique identifier for the user
   * @param {string} userData.email - User's email address
   * @param {string} userData.name - User's full name
   * @param {string} userData.subscriptionTier - User's subscription tier ('free', 'pro', 'premium')
   * @param {string} userData.stripeCustomerId - User's Stripe customer ID
   * @param {string} userData.createdAt - Timestamp when the user was created
   * @param {string} userData.updatedAt - Timestamp when the user was last updated
   */
  constructor(userData) {
    this.userId = userData.userId;
    this.email = userData.email;
    this.name = userData.name || '';
    this.subscriptionTier = userData.subscriptionTier || 'free';
    this.stripeCustomerId = userData.stripeCustomerId || null;
    this.createdAt = userData.createdAt ? new Date(userData.createdAt) : new Date();
    this.updatedAt = userData.updatedAt ? new Date(userData.updatedAt) : new Date();
  }

  /**
   * Check if the user has a specific subscription tier or higher
   * 
   * @param {string} tier - The tier to check ('free', 'pro', 'premium')
   * @returns {boolean} - Whether the user has the specified tier or higher
   */
  hasTier(tier) {
    const tierLevels = {
      'free': 0,
      'pro': 1,
      'premium': 2
    };

    const userTierLevel = tierLevels[this.subscriptionTier] || 0;
    const requiredTierLevel = tierLevels[tier] || 0;

    return userTierLevel >= requiredTierLevel;
  }

  /**
   * Check if the user is on a free plan
   * 
   * @returns {boolean} - Whether the user is on a free plan
   */
  isFreeTier() {
    return this.subscriptionTier === 'free';
  }

  /**
   * Check if the user is on a pro plan
   * 
   * @returns {boolean} - Whether the user is on a pro plan
   */
  isProTier() {
    return this.subscriptionTier === 'pro';
  }

  /**
   * Check if the user is on a premium plan
   * 
   * @returns {boolean} - Whether the user is on a premium plan
   */
  isPremiumTier() {
    return this.subscriptionTier === 'premium';
  }

  /**
   * Get the maximum number of edits allowed for the user's tier
   * 
   * @returns {number} - Maximum number of edits (-1 for unlimited)
   */
  getEditLimit() {
    switch (this.subscriptionTier) {
      case 'premium':
      case 'pro':
        return -1; // Unlimited
      case 'free':
      default:
        return 5;
    }
  }

  /**
   * Convert the User instance to a plain object
   * 
   * @returns {Object} - Plain object representation of the User
   */
  toObject() {
    return {
      userId: this.userId,
      email: this.email,
      name: this.name,
      subscriptionTier: this.subscriptionTier,
      stripeCustomerId: this.stripeCustomerId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Create a User instance from a Supabase user and profile
   * 
   * @param {Object} supabaseUser - User object from Supabase Auth
   * @param {Object} profileData - Profile data from Supabase profiles table
   * @returns {User} - New User instance
   */
  static fromSupabase(supabaseUser, profileData = {}) {
    return new User({
      userId: supabaseUser.id,
      email: supabaseUser.email,
      name: profileData.name || supabaseUser.user_metadata?.name || '',
      subscriptionTier: profileData.subscriptionTier || 'free',
      stripeCustomerId: profileData.stripeCustomerId || null,
      createdAt: profileData.createdAt || supabaseUser.created_at,
      updatedAt: profileData.updatedAt || supabaseUser.updated_at
    });
  }
}

export default User;

