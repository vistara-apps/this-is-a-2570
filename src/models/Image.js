/**
 * Image Model
 * 
 * Represents an image in the application.
 * This model corresponds to the 'images' table in Supabase.
 */

/**
 * Image class representing an image in the application
 */
class Image {
  /**
   * Create a new Image instance
   * 
   * @param {Object} imageData - Image data from Supabase
   * @param {string} imageData.imageId - Unique identifier for the image
   * @param {string} imageData.userId - ID of the user who owns the image
   * @param {string} imageData.originalUrl - URL of the original image
   * @param {string} imageData.editedUrl - URL of the edited image (optional)
   * @param {string} imageData.name - Name of the image
   * @param {number} imageData.size - Size of the image in bytes
   * @param {string} imageData.type - MIME type of the image
   * @param {Object} imageData.metadata - Additional metadata for the image
   * @param {string} imageData.createdAt - Timestamp when the image was created
   * @param {string} imageData.editedAt - Timestamp when the image was last edited
   */
  constructor(imageData) {
    this.imageId = imageData.imageId;
    this.userId = imageData.userId;
    this.originalUrl = imageData.originalUrl;
    this.editedUrl = imageData.editedUrl || null;
    this.name = imageData.name || 'Untitled';
    this.size = imageData.size || 0;
    this.type = imageData.type || 'image/jpeg';
    this.metadata = imageData.metadata || {};
    this.createdAt = imageData.createdAt ? new Date(imageData.createdAt) : new Date();
    this.editedAt = imageData.editedAt ? new Date(imageData.editedAt) : null;
  }

  /**
   * Check if the image has been edited
   * 
   * @returns {boolean} - Whether the image has been edited
   */
  isEdited() {
    return !!this.editedUrl;
  }

  /**
   * Get the URL to display for the image (edited if available, otherwise original)
   * 
   * @returns {string} - URL to display
   */
  getDisplayUrl() {
    return this.editedUrl || this.originalUrl;
  }

  /**
   * Get the formatted size of the image
   * 
   * @returns {string} - Formatted size (e.g., "1.2 MB")
   */
  getFormattedSize() {
    const kb = this.size / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    } else {
      const mb = kb / 1024;
      return `${mb.toFixed(1)} MB`;
    }
  }

  /**
   * Update the edited URL and timestamp
   * 
   * @param {string} editedUrl - New edited URL
   * @returns {Image} - Updated Image instance
   */
  updateEditedUrl(editedUrl) {
    this.editedUrl = editedUrl;
    this.editedAt = new Date();
    return this;
  }

  /**
   * Convert the Image instance to a plain object
   * 
   * @returns {Object} - Plain object representation of the Image
   */
  toObject() {
    return {
      imageId: this.imageId,
      userId: this.userId,
      originalUrl: this.originalUrl,
      editedUrl: this.editedUrl,
      name: this.name,
      size: this.size,
      type: this.type,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      editedAt: this.editedAt ? this.editedAt.toISOString() : null
    };
  }

  /**
   * Create an Image instance from a Supabase record
   * 
   * @param {Object} record - Image record from Supabase
   * @returns {Image} - New Image instance
   */
  static fromSupabase(record) {
    return new Image({
      imageId: record.id,
      userId: record.userId,
      originalUrl: record.originalUrl,
      editedUrl: record.editedUrl,
      name: record.name,
      size: record.size,
      type: record.type,
      metadata: record.metadata,
      createdAt: record.createdAt,
      editedAt: record.editedAt
    });
  }

  /**
   * Create an Image instance from a File object
   * 
   * @param {File} file - File object from file input
   * @param {string} userId - ID of the user who owns the image
   * @param {string} originalUrl - URL of the original image
   * @returns {Image} - New Image instance
   */
  static fromFile(file, userId, originalUrl) {
    return new Image({
      imageId: null, // Will be assigned by Supabase
      userId,
      originalUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      createdAt: new Date()
    });
  }
}

export default Image;

