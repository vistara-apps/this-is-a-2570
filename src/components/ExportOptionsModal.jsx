import React, { useState } from 'react'
import { X, Download, Image, FileText } from 'lucide-react'

const ExportOptionsModal = ({ image, adjustments, onClose }) => {
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(90)
  const [size, setSize] = useState('original')

  const formats = [
    { id: 'png', label: 'PNG', description: 'Best for transparency', icon: Image },
    { id: 'jpg', label: 'JPG', description: 'Smaller file size', icon: FileText },
  ]

  const sizes = [
    { id: 'original', label: 'Original Size', description: 'Keep original dimensions' },
    { id: 'large', label: 'Large (2048px)', description: 'Good for printing' },
    { id: 'medium', label: 'Medium (1024px)', description: 'Web optimized' },
    { id: 'small', label: 'Small (512px)', description: 'Social media' },
  ]

  const handleExport = () => {
    // Create a canvas to export the image with filters
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Apply filters to context
      const filterString = [
        `brightness(${100 + adjustments.brightness}%)`,
        `contrast(${100 + adjustments.contrast}%)`,
        `saturate(${100 + adjustments.saturation}%)`,
        adjustments.blur > 0 ? `blur(${adjustments.blur}px)` : '',
        adjustments.sepia > 0 ? `sepia(${adjustments.sepia}%)` : '',
        adjustments.hueRotate !== 0 ? `hue-rotate(${adjustments.hueRotate}deg)` : ''
      ].filter(Boolean).join(' ')
      
      ctx.filter = filterString
      ctx.drawImage(img, 0, 0)
      
      // Download the image
      const link = document.createElement('a')
      link.download = `pixelflow-edited.${format}`
      link.href = canvas.toDataURL(`image/${format}`, quality / 100)
      link.click()
      
      onClose()
    }
    
    img.src = image.src
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading text-white">Export Options</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-white font-medium mb-3 block">Format</label>
            <div className="space-y-2">
              {formats.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id)}
                  className={`
                    w-full p-3 rounded-lg text-left transition-colors flex items-center space-x-3
                    ${format === fmt.id 
                      ? 'bg-accent/20 border-2 border-accent' 
                      : 'bg-white/10 border-2 border-transparent hover:bg-white/20'
                    }
                  `}
                >
                  <fmt.icon className="w-5 h-5 text-white" />
                  <div>
                    <div className="text-white font-medium">{fmt.label}</div>
                    <div className="text-white/70 text-sm">{fmt.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPG) */}
          {format === 'jpg' && (
            <div>
              <label className="text-white font-medium mb-3 block">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}

          {/* Size Selection */}
          <div>
            <label className="text-white font-medium mb-3 block">Size</label>
            <div className="space-y-2">
              {sizes.map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => setSize(sz.id)}
                  className={`
                    w-full p-3 rounded-lg text-left transition-colors
                    ${size === sz.id 
                      ? 'bg-accent/20 border-2 border-accent' 
                      : 'bg-white/10 border-2 border-transparent hover:bg-white/20'
                    }
                  `}
                >
                  <div className="text-white font-medium">{sz.label}</div>
                  <div className="text-white/70 text-sm">{sz.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export Image</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportOptionsModal