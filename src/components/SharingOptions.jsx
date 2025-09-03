import React, { useState } from 'react';
import { Share2, Copy, Download, Twitter, Facebook, Instagram, Linkedin, Link } from 'lucide-react';
import Tooltip from './Tooltip';
import Notification from './Notification';

const SharingOptions = ({ imageUrl, fileName = 'pixelflow-image' }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Copy image URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      showSuccessNotification('Image URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      showErrorNotification('Failed to copy URL to clipboard');
    }
  };

  // Download image
  const downloadImage = () => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccessNotification('Image download started!');
    } catch (error) {
      console.error('Failed to download image:', error);
      showErrorNotification('Failed to download image');
    }
  };

  // Share to social media
  const shareToSocial = (platform) => {
    let shareUrl = '';
    const text = 'Check out this image I edited with PixelFlow AI!';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageUrl)}`;
        break;
      default:
        showErrorNotification('Sharing to this platform is not supported');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    showSuccessNotification(`Sharing to ${platform}!`);
  };

  // Show success notification
  const showSuccessNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Show error notification
  const showErrorNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Sharing buttons */}
      <div className="flex flex-wrap gap-2">
        <Tooltip content="Copy Link">
          <button
            onClick={copyToClipboard}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <Tooltip content="Download">
          <button
            onClick={downloadImage}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <Tooltip content="Share to Twitter">
          <button
            onClick={() => shareToSocial('twitter')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <Tooltip content="Share to Facebook">
          <button
            onClick={() => shareToSocial('facebook')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <Tooltip content="Share to LinkedIn">
          <button
            onClick={() => shareToSocial('linkedin')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
      
      {/* Notification */}
      {showNotification && (
        <div className="absolute top-12 right-0 z-50">
          <Notification
            variant="success"
            message={notificationMessage}
            duration={3000}
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SharingOptions;

