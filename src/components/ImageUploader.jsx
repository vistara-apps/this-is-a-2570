import React, { useState, useRef } from 'react'
import { Upload, Image, FileImage } from 'lucide-react'

const ImageUploader = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageUpload({
          src: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div
        className={`
          w-full max-w-md p-8 border-2 border-dashed rounded-xl text-center cursor-pointer
          transition-all duration-200 ${
            isDragging
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-white/30 text-white/70 hover:border-accent hover:bg-accent/5 hover:text-accent'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {isDragging ? (
              <FileImage className="w-16 h-16" />
            ) : (
              <Upload className="w-16 h-16" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {isDragging ? 'Drop your image here' : 'Upload an image'}
            </h3>
            <p className="text-sm opacity-70">
              Drag and drop or click to select a file
            </p>
            <p className="text-xs opacity-50 mt-2">
              Supports JPG, PNG, GIF up to 10MB
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 text-xs opacity-50">
            <span>• Background removal</span>
            <span>• AI enhancement</span>
            <span>• Filters</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader