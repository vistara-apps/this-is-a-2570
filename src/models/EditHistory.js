/**
 * EditHistory Model
 * 
 * Represents an edit operation in the application.
 * This model corresponds to the 'editHistory' table in Supabase.
 */

/**
 * EditHistory class representing an edit operation in the application
 */
class EditHistory {
  /**
   * Create a new EditHistory instance
   * 
   * @param {Object} editData - Edit operation data from Supabase
   * @param {string} editData.editHistoryId - Unique identifier for the edit history
   * @param {string} editData.imageId - ID of the image that was edited
   * @param {string} editData.userId - ID of the user who performed the edit
   * @param {string} editData.operationType - Type of edit operation
   * @param {Object} editData.parameters - Parameters used for the edit
   * @param {string} editData.timestamp - Timestamp when the edit was performed
   */
  constructor(editData) {
    this.editHistoryId = editData.editHistoryId;
    this.imageId = editData.imageId;
    this.userId = editData.userId;
    this.operationType = editData.operationType;
    this.parameters = editData.parameters || {};
    this.timestamp = editData.timestamp ? new Date(editData.timestamp) : new Date();
  }

  /**
   * Get a human-readable description of the edit operation
   * 
   * @returns {string} - Human-readable description
   */
  getDescription() {
    switch (this.operationType) {
      case 'adjustment':
        return 'Basic adjustments applied';
      case 'removeBackground':
        return 'Background removed';
      case 'filter':
        return `Filter applied: ${this.parameters.filterName || 'Unknown'}`;
      case 'aiEnhance':
        return 'AI enhancement applied';
      case 'crop':
        return 'Image cropped';
      case 'resize':
        return `Image resized to ${this.parameters.width || '?'}x${this.parameters.height || '?'}`;
      default:
        return 'Edit applied';
    }
  }

  /**
   * Check if the edit operation can be undone
   * 
   * @returns {boolean} - Whether the operation can be undone
   */
  isUndoable() {
    // Some operations might not be undoable
    return true;
  }

  /**
   * Convert the EditHistory instance to a plain object
   * 
   * @returns {Object} - Plain object representation of the EditHistory
   */
  toObject() {
    return {
      editHistoryId: this.editHistoryId,
      imageId: this.imageId,
      userId: this.userId,
      operationType: this.operationType,
      parameters: this.parameters,
      timestamp: this.timestamp.toISOString()
    };
  }

  /**
   * Create an EditHistory instance from a Supabase record
   * 
   * @param {Object} record - EditHistory record from Supabase
   * @returns {EditHistory} - New EditHistory instance
   */
  static fromSupabase(record) {
    return new EditHistory({
      editHistoryId: record.id,
      imageId: record.imageId,
      userId: record.userId,
      operationType: record.operationType,
      parameters: record.parameters,
      timestamp: record.timestamp
    });
  }

  /**
   * Create a new adjustment edit history
   * 
   * @param {string} imageId - ID of the image
   * @param {string} userId - ID of the user
   * @param {Object} adjustments - Adjustment parameters
   * @returns {EditHistory} - New EditHistory instance
   */
  static createAdjustment(imageId, userId, adjustments) {
    return new EditHistory({
      imageId,
      userId,
      operationType: 'adjustment',
      parameters: adjustments
    });
  }

  /**
   * Create a new background removal edit history
   * 
   * @param {string} imageId - ID of the image
   * @param {string} userId - ID of the user
   * @param {Object} options - Background removal options
   * @returns {EditHistory} - New EditHistory instance
   */
  static createBackgroundRemoval(imageId, userId, options = {}) {
    return new EditHistory({
      imageId,
      userId,
      operationType: 'removeBackground',
      parameters: options
    });
  }

  /**
   * Create a new filter edit history
   * 
   * @param {string} imageId - ID of the image
   * @param {string} userId - ID of the user
   * @param {string} filterName - Name of the filter
   * @param {Object} options - Filter options
   * @returns {EditHistory} - New EditHistory instance
   */
  static createFilter(imageId, userId, filterName, options = {}) {
    return new EditHistory({
      imageId,
      userId,
      operationType: 'filter',
      parameters: {
        filterName,
        ...options
      }
    });
  }
}

export default EditHistory;

