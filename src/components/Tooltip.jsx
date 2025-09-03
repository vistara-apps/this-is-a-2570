import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 300,
  className = '',
  tooltipClassName = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);

  // Calculate tooltip position based on target element and desired position
  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = targetRect.top + scrollY - tooltipRect.height - 8;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + 8;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left + scrollX - tooltipRect.width - 8;
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + scrollX + 8;
        break;
      default:
        top = targetRect.top + scrollY - tooltipRect.height - 8;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position if needed
    if (left < 10) {
      left = 10;
    } else if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }

    // Adjust vertical position if needed
    if (top < 10) {
      top = targetRect.bottom + scrollY + 8; // Flip to bottom if too close to top
    } else if (top + tooltipRect.height > viewportHeight + scrollY - 10) {
      top = targetRect.top + scrollY - tooltipRect.height - 8; // Flip to top if too close to bottom
    }

    setTooltipPosition({ top, left });
  };

  // Handle mouse enter
  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip is visible
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isVisible]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div 
      className={`inline-block ${className}`}
      ref={targetRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-sm bg-gray-900 text-white rounded shadow-lg pointer-events-none whitespace-nowrap animate-fadeIn ${tooltipClassName}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-0 translate-y-1/2' : 
              position === 'bottom' ? 'top-0 -translate-y-1/2' : 
              position === 'left' ? 'right-0 translate-x-1/2' : 
              'left-0 -translate-x-1/2'
            }`}
            style={{
              left: position === 'top' || position === 'bottom' ? '50%' : undefined,
              top: position === 'left' || position === 'right' ? '50%' : undefined
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;

