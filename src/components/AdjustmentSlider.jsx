import React from 'react'

const AdjustmentSlider = ({ label, value, min, max, unit, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-white text-sm font-medium">{label}</label>
        <span className="text-white/70 text-sm">
          {value}{unit}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(170, 70%, 45%);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(170, 70%, 45%);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export default AdjustmentSlider