import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';

const ColorPicker = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(color || '#ffffff');
  const pickerRef = useRef(null);

  // Predefined color palette
  const colorPalette = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#00ffff', '#ff00ff', '#ff8800', '#8800ff',
    '#ff0088', '#00ff88', '#0088ff', '#88ff00', '#880000',
    '#008800', '#000088', '#888888', '#444444', '#cccccc'
  ];

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update current color when prop changes
  useEffect(() => {
    if (color) {
      setCurrentColor(color);
    }
  }, [color]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handlePaletteColorClick = (paletteColor) => {
    setCurrentColor(paletteColor);
    onChange(paletteColor);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="block text-white mb-1">{label}</label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 w-full"
      >
        <div 
          className="w-5 h-5 rounded-full border border-white/30" 
          style={{ backgroundColor: currentColor }}
        />
        <span>{currentColor}</span>
        <Palette className="w-4 h-4 ml-auto" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-lg p-3 animate-fadeIn">
          {/* Color input */}
          <input
            type="color"
            value={currentColor}
            onChange={handleColorChange}
            className="w-full h-10 rounded cursor-pointer mb-3"
          />
          
          {/* Hex input */}
          <input
            type="text"
            value={currentColor}
            onChange={handleColorChange}
            className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 mb-3"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            placeholder="#RRGGBB"
          />
          
          {/* Color palette */}
          <div className="grid grid-cols-5 gap-2">
            {colorPalette.map((paletteColor) => (
              <button
                key={paletteColor}
                type="button"
                onClick={() => handlePaletteColorClick(paletteColor)}
                className="w-8 h-8 rounded-full border border-white/30 hover:scale-110 transition-transform"
                style={{ backgroundColor: paletteColor }}
                aria-label={`Select color ${paletteColor}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

