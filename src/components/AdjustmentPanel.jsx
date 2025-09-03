import React from 'react'
import { RotateCcw } from 'lucide-react'
import AdjustmentSlider from './AdjustmentSlider'

const AdjustmentPanel = ({ adjustments, onAdjustmentChange, onReset }) => {
  const adjustmentOptions = [
    { key: 'brightness', label: 'Brightness', min: -50, max: 50, unit: '' },
    { key: 'contrast', label: 'Contrast', min: -50, max: 50, unit: '' },
    { key: 'saturation', label: 'Saturation', min: -50, max: 50, unit: '' },
    { key: 'blur', label: 'Blur', min: 0, max: 10, unit: 'px' },
    { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
    { key: 'hueRotate', label: 'Hue Rotate', min: -180, max: 180, unit: '°' },
  ]

  return (
    <div className="space-y-4">
      {adjustmentOptions.map((option) => (
        <AdjustmentSlider
          key={option.key}
          label={option.label}
          value={adjustments[option.key]}
          min={option.min}
          max={option.max}
          unit={option.unit}
          onChange={(value) => onAdjustmentChange(option.key, value)}
        />
      ))}
      
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center space-x-2 mt-6 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset All</span>
      </button>
    </div>
  )
}

export default AdjustmentPanel