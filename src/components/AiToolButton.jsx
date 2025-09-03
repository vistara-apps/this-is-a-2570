import React from 'react'
import { Lock, Crown } from 'lucide-react'

const AiToolButton = ({ 
  icon: Icon, 
  label, 
  description, 
  onClick, 
  disabled, 
  isLocked,
  isPro 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 rounded-lg text-left transition-all duration-200 relative
        ${disabled 
          ? 'bg-white/5 text-white/40 cursor-not-allowed' 
          : 'bg-white/10 hover:bg-white/20 text-white hover:scale-105'
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`
          p-2 rounded-lg flex-shrink-0
          ${disabled ? 'bg-white/10' : 'bg-accent/20'}
        `}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium">{label}</h3>
            {isPro && (
              <Crown className="w-3 h-3 text-yellow-400" />
            )}
            {isLocked && (
              <Lock className="w-3 h-3 text-white/40" />
            )}
          </div>
          <p className="text-xs text-white/70">{description}</p>
        </div>
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
          <Lock className="w-6 h-6 text-white/40" />
        </div>
      )}
    </button>
  )
}

export default AiToolButton