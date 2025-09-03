import React from 'react'
import { Scissors, Sparkles, Palette, Lock } from 'lucide-react'
import AiToolButton from './AiToolButton'

const AiToolPanel = ({ onAiTool, isProcessing, userTier, editCount }) => {
  const tools = [
    {
      id: 'removeBackground',
      label: 'Remove Background',
      icon: Scissors,
      description: 'AI-powered background removal',
      isPro: false
    },
    {
      id: 'enhance',
      label: 'Auto Enhance',
      icon: Sparkles,
      description: 'Intelligent photo enhancement',
      isPro: false
    },
    {
      id: 'stylize',
      label: 'Artistic Style',
      icon: Palette,
      description: 'Apply artistic filters',
      isPro: true
    },
    {
      id: 'upscale',
      label: 'AI Upscale',
      icon: Sparkles,
      description: 'Increase image resolution',
      isPro: true
    }
  ]

  const canUseFeature = (isPro) => {
    if (isPro && userTier === 'free') return false
    if (userTier === 'free' && editCount >= 5) return false
    return true
  }

  return (
    <div className="space-y-3">
      {tools.map((tool) => {
        const isLocked = !canUseFeature(tool.isPro)
        
        return (
          <AiToolButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            description={tool.description}
            onClick={() => onAiTool(tool.id)}
            disabled={isProcessing || isLocked}
            isLocked={isLocked}
            isPro={tool.isPro}
          />
        )
      })}
      
      {userTier === 'free' && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-200 mb-1">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Free Tier Limits</span>
          </div>
          <p className="text-xs text-yellow-200/80">
            {editCount}/5 edits used. Upgrade for unlimited access to all AI tools.
          </p>
        </div>
      )}
    </div>
  )
}

export default AiToolPanel