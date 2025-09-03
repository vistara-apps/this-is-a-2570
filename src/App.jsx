import React, { useState } from 'react'
import NavigationBar from './components/NavigationBar'
import ImageUploader from './components/ImageUploader'
import ImageEditor from './components/ImageEditor'
import AdjustmentPanel from './components/AdjustmentPanel'
import AiToolPanel from './components/AiToolPanel'
import ExportOptionsModal from './components/ExportOptionsModal'
import UpgradeModal from './components/UpgradeModal'

function App() {
  const [currentImage, setCurrentImage] = useState(null)
  const [imageHistory, setImageHistory] = useState([])
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    sepia: 0,
    hueRotate: 0
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [userTier, setUserTier] = useState('free') // free, pro, premium
  const [editCount, setEditCount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = (imageData) => {
    setCurrentImage(imageData)
    setImageHistory([imageData])
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sepia: 0,
      hueRotate: 0
    })
  }

  const handleAdjustmentChange = (type, value) => {
    setAdjustments(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleAiTool = async (toolType) => {
    if (userTier === 'free' && editCount >= 5) {
      setShowUpgradeModal(true)
      return
    }

    setIsProcessing(true)
    setEditCount(prev => prev + 1)

    // Simulate AI processing
    setTimeout(() => {
      if (toolType === 'removeBackground') {
        // Simulate background removal by adding a filter effect
        setAdjustments(prev => ({
          ...prev,
          // This would normally be handled by actual background removal
          // For demo, we'll add a slight effect
          contrast: prev.contrast + 10
        }))
      } else if (toolType === 'enhance') {
        // Auto-enhance simulation
        setAdjustments({
          brightness: 15,
          contrast: 20,
          saturation: 10,
          blur: 0,
          sepia: 0,
          hueRotate: 0
        })
      }
      setIsProcessing(false)
    }, 2000)
  }

  const handleExport = () => {
    setShowExportModal(true)
  }

  const handleUpgrade = (tier) => {
    setUserTier(tier)
    setShowUpgradeModal(false)
    // In a real app, this would integrate with Stripe
  }

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sepia: 0,
      hueRotate: 0
    })
  }

  return (
    <div className="min-h-screen gradient-bg">
      <NavigationBar userTier={userTier} onUpgrade={() => setShowUpgradeModal(true)} />
      
      <div className="flex flex-col lg:flex-row min-h-screen pt-16">
        {/* Left Sidebar - Controls */}
        <div className="w-full lg:w-80 p-4 lg:p-6 space-y-6 overflow-y-auto">
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-heading text-white mb-4">Adjustments</h2>
            <AdjustmentPanel 
              adjustments={adjustments}
              onAdjustmentChange={handleAdjustmentChange}
              onReset={resetAdjustments}
            />
          </div>

          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-heading text-white mb-4">AI Tools</h2>
            <AiToolPanel 
              onAiTool={handleAiTool}
              isProcessing={isProcessing}
              userTier={userTier}
              editCount={editCount}
            />
          </div>
        </div>

        {/* Main Content - Image Editor */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="glass-panel rounded-lg p-6 h-full">
            {currentImage ? (
              <ImageEditor 
                image={currentImage}
                adjustments={adjustments}
                onExport={handleExport}
                isProcessing={isProcessing}
              />
            ) : (
              <ImageUploader onImageUpload={handleImageUpload} />
            )}
          </div>
        </div>

        {/* Right Sidebar - Additional Tools */}
        <div className="w-full lg:w-80 p-4 lg:p-6 space-y-6">
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-heading text-white mb-4">Usage</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span className="text-caption">Edits Used:</span>
                <span className="text-caption">{editCount}/5</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((editCount / 5) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-caption text-white/70">
                {userTier === 'free' ? 'Upgrade for unlimited edits' : 'Unlimited edits available'}
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-heading text-white mb-4">History</h2>
            <div className="space-y-2">
              {imageHistory.length > 0 ? (
                <div className="text-caption text-white/70">
                  {imageHistory.length} image{imageHistory.length !== 1 ? 's' : ''} processed
                </div>
              ) : (
                <div className="text-caption text-white/70">
                  No images processed yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExportModal && (
        <ExportOptionsModal 
          image={currentImage}
          adjustments={adjustments}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showUpgradeModal && (
        <UpgradeModal 
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  )
}

export default App