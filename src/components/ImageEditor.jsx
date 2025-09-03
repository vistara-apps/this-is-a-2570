import React, { useRef, useEffect } from 'react'
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

const ImageEditor = ({ image, adjustments, onExport, isProcessing }) => {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  const getFilterString = () => {
    const filters = []
    
    if (adjustments.brightness !== 0) {
      filters.push(`brightness(${100 + adjustments.brightness}%)`)
    }
    if (adjustments.contrast !== 0) {
      filters.push(`contrast(${100 + adjustments.contrast}%)`)
    }
    if (adjustments.saturation !== 0) {
      filters.push(`saturate(${100 + adjustments.saturation}%)`)
    }
    if (adjustments.blur > 0) {
      filters.push(`blur(${adjustments.blur}px)`)
    }
    if (adjustments.sepia > 0) {
      filters.push(`sepia(${adjustments.sepia}%)`)
    }
    if (adjustments.hueRotate !== 0) {
      filters.push(`hue-rotate(${adjustments.hueRotate}deg)`)
    }
    
    return filters.join(' ')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">{image.name}</span>
          <span className="text-white/50 text-sm">
            ({Math.round(image.size / 1024)}KB)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onExport}
            className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
            <div className="text-white text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Processing with AI...</p>
            </div>
          </div>
        )}
        
        <div className="max-w-full max-h-full">
          <img
            ref={imageRef}
            src={image.src}
            alt="Editing preview"
            className="max-w-full max-h-full object-contain rounded-lg transition-all duration-200"
            style={{
              filter: getFilterString(),
              transform: isProcessing ? 'scale(0.98)' : 'scale(1)'
            }}
          />
        </div>
      </div>

      {/* Canvas for export (hidden) */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  )
}

export default ImageEditor