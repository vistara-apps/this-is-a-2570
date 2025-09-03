import React from 'react'
import { Menu, User, Crown, Zap } from 'lucide-react'

const NavigationBar = ({ userTier, onUpgrade }) => {
  const getTierIcon = () => {
    switch (userTier) {
      case 'pro':
        return <Zap className="w-4 h-4 text-accent" />
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-400" />
      default:
        return <User className="w-4 h-4 text-white/70" />
    }
  }

  const getTierLabel = () => {
    switch (userTier) {
      case 'pro':
        return 'Pro'
      case 'premium':
        return 'Premium'
      default:
        return 'Free'
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-white">PixelFlow AI</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white/80 hover:text-white transition-colors">Editor</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Gallery</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Templates</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* User Tier Display */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
              {getTierIcon()}
              <span className="text-white text-sm font-medium">{getTierLabel()}</span>
            </div>

            {/* Upgrade Button */}
            {userTier === 'free' && (
              <button
                onClick={onUpgrade}
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Upgrade
              </button>
            )}

            {/* Menu Button for Mobile */}
            <button className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar