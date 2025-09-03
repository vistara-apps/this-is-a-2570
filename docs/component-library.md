# PixelFlow AI Component Library

This document provides a comprehensive reference for all the UI components used in the PixelFlow AI application.

## Table of Contents

1. [Core Components](#core-components)
2. [Image Editing Components](#image-editing-components)
3. [Authentication Components](#authentication-components)
4. [Subscription Components](#subscription-components)
5. [Utility Components](#utility-components)

---

## Core Components

### NavigationBar

The main navigation bar for the application.

**Props:**
- `userTier` (String): The user's subscription tier ('free', 'pro', 'premium')
- `onUpgrade` (Function): Callback function when the upgrade button is clicked

**Usage:**
```jsx
<NavigationBar userTier="free" onUpgrade={() => setShowUpgradeModal(true)} />
```

### ImageUploader

Component for uploading images to the application.

**Props:**
- `onImageUpload` (Function): Callback function when an image is uploaded

**Usage:**
```jsx
<ImageUploader onImageUpload={handleImageUpload} />
```

### ImageEditor

Component for editing images with various adjustments and filters.

**Props:**
- `image` (Object): The image object to edit
- `adjustments` (Object): Adjustment parameters for the image
- `onExport` (Function): Callback function when the export button is clicked
- `isProcessing` (Boolean): Whether the image is currently being processed

**Usage:**
```jsx
<ImageEditor 
  image={currentImage}
  adjustments={adjustments}
  onExport={handleExport}
  isProcessing={isProcessing}
/>
```

### AdjustmentPanel

Panel for adjusting image properties like brightness, contrast, etc.

**Props:**
- `adjustments` (Object): Current adjustment values
- `onAdjustmentChange` (Function): Callback function when an adjustment is changed
- `onReset` (Function): Callback function when the reset button is clicked

**Usage:**
```jsx
<AdjustmentPanel 
  adjustments={adjustments}
  onAdjustmentChange={handleAdjustmentChange}
  onReset={resetAdjustments}
/>
```

### AdjustmentSlider

Slider component for adjusting a specific image property.

**Props:**
- `label` (String): Label for the slider
- `value` (Number): Current value of the slider
- `min` (Number): Minimum value of the slider
- `max` (Number): Maximum value of the slider
- `step` (Number): Step value of the slider
- `onChange` (Function): Callback function when the slider value changes

**Usage:**
```jsx
<AdjustmentSlider 
  label="Brightness"
  value={adjustments.brightness}
  min={-100}
  max={100}
  step={1}
  onChange={(value) => handleAdjustmentChange('brightness', value)}
/>
```

### AiToolPanel

Panel for AI-powered image editing tools.

**Props:**
- `onAiTool` (Function): Callback function when an AI tool is selected
- `isProcessing` (Boolean): Whether an AI tool is currently processing
- `userTier` (String): The user's subscription tier
- `editCount` (Number): Number of edits used

**Usage:**
```jsx
<AiToolPanel 
  onAiTool={handleAiTool}
  isProcessing={isProcessing}
  userTier={userTier}
  editCount={editCount}
/>
```

### AiToolButton

Button component for an AI tool.

**Props:**
- `icon` (Component): Icon component for the tool
- `label` (String): Label for the tool
- `description` (String): Description of the tool
- `onClick` (Function): Callback function when the button is clicked
- `disabled` (Boolean): Whether the button is disabled
- `isLocked` (Boolean): Whether the tool is locked (requires upgrade)
- `isPro` (Boolean): Whether the tool is a pro feature

**Usage:**
```jsx
<AiToolButton
  icon={Scissors}
  label="Remove Background"
  description="AI-powered background removal"
  onClick={() => onAiTool('removeBackground')}
  disabled={isProcessing}
  isLocked={false}
  isPro={false}
/>
```

### ExportOptionsModal

Modal for configuring export options.

**Props:**
- `image` (Object): The image to export
- `adjustments` (Object): Adjustment parameters for the image
- `onClose` (Function): Callback function when the modal is closed

**Usage:**
```jsx
<ExportOptionsModal 
  image={currentImage}
  adjustments={adjustments}
  onClose={() => setShowExportModal(false)}
/>
```

### UpgradeModal

Modal for upgrading to a paid subscription.

**Props:**
- `onClose` (Function): Callback function when the modal is closed
- `onUpgrade` (Function): Callback function when a plan is selected

**Usage:**
```jsx
<UpgradeModal 
  onClose={() => setShowUpgradeModal(false)}
  onUpgrade={handleUpgrade}
/>
```

---

## Image Editing Components

### ColorPicker

Component for selecting colors.

**Props:**
- `color` (String): Current color value
- `onChange` (Function): Callback function when the color is changed
- `label` (String): Label for the color picker

**Usage:**
```jsx
<ColorPicker 
  color="#ff0000"
  onChange={handleColorChange}
  label="Background Color"
/>
```

### SharingOptions

Component for sharing edited images.

**Props:**
- `imageUrl` (String): URL of the image to share
- `fileName` (String): Name of the file for download

**Usage:**
```jsx
<SharingOptions 
  imageUrl={currentImage.getDisplayUrl()}
  fileName="pixelflow-edited"
/>
```

---

## Authentication Components

### SignUp

Component for user registration.

**Props:**
- `onSuccess` (Function): Callback function when sign up is successful
- `onLoginClick` (Function): Callback function when the login link is clicked

**Usage:**
```jsx
<SignUp 
  onSuccess={handleSignUpSuccess}
  onLoginClick={() => setAuthMode('login')}
/>
```

### Login

Component for user login.

**Props:**
- `onSuccess` (Function): Callback function when login is successful
- `onSignUpClick` (Function): Callback function when the sign up link is clicked
- `onForgotPasswordClick` (Function): Callback function when the forgot password link is clicked

**Usage:**
```jsx
<Login 
  onSuccess={handleLoginSuccess}
  onSignUpClick={() => setAuthMode('signup')}
  onForgotPasswordClick={() => setAuthMode('reset')}
/>
```

### PasswordReset

Component for resetting a forgotten password.

**Props:**
- `onBackToLogin` (Function): Callback function when the back to login link is clicked

**Usage:**
```jsx
<PasswordReset 
  onBackToLogin={() => setAuthMode('login')}
/>
```

### Profile

Component for viewing and editing user profile information.

**Props:**
- None (uses AuthContext)

**Usage:**
```jsx
<Profile />
```

### ProtectedRoute

Component for restricting access to authenticated users.

**Props:**
- `children` (ReactNode): Child components to render if authenticated
- `requiredTier` (String): Optional subscription tier required for access
- `redirectTo` (String): Path to redirect to if not authenticated

**Usage:**
```jsx
<ProtectedRoute requiredTier="pro" redirectTo="/login">
  <PremiumFeature />
</ProtectedRoute>
```

---

## Subscription Components

### PlanSelector

Component for selecting a subscription plan.

**Props:**
- `onSelectPlan` (Function): Callback function when a plan is selected
- `onClose` (Function): Callback function when the component is closed

**Usage:**
```jsx
<PlanSelector 
  onSelectPlan={handlePlanSelect}
  onClose={() => setShowPlanSelector(false)}
/>
```

### CheckoutForm

Component for completing a subscription purchase.

**Props:**
- `selectedPlan` (Object): The selected subscription plan
- `onBack` (Function): Callback function when the back button is clicked
- `onSuccess` (Function): Callback function when checkout is successful

**Usage:**
```jsx
<CheckoutForm 
  selectedPlan={selectedPlan}
  onBack={() => setCheckoutStep('select')}
  onSuccess={handleCheckoutSuccess}
/>
```

### SubscriptionManager

Component for managing an existing subscription.

**Props:**
- None (uses AuthContext and SubscriptionContext)

**Usage:**
```jsx
<SubscriptionManager />
```

---

## Utility Components

### Tooltip

Component for displaying tooltips.

**Props:**
- `children` (ReactNode): The element to attach the tooltip to
- `content` (String): The tooltip content
- `position` (String): The position of the tooltip ('top', 'bottom', 'left', 'right')
- `delay` (Number): Delay before showing the tooltip (in milliseconds)
- `className` (String): Additional CSS classes for the tooltip container
- `tooltipClassName` (String): Additional CSS classes for the tooltip itself

**Usage:**
```jsx
<Tooltip content="Click to apply filter" position="top">
  <button>Apply Filter</button>
</Tooltip>
```

### Notification

Component for displaying notifications.

**Props:**
- `title` (String): Title of the notification
- `message` (String): Message of the notification
- `variant` (String): Variant of the notification ('success', 'error', 'warning', 'info')
- `duration` (Number): Duration to show the notification (in milliseconds)
- `onClose` (Function): Callback function when the notification is closed
- `isVisible` (Boolean): Whether the notification is visible

**Usage:**
```jsx
<Notification 
  title="Success"
  message="Image successfully exported"
  variant="success"
  duration={3000}
  onClose={() => setShowNotification(false)}
  isVisible={showNotification}
/>
```

### LoadingSpinner

Component for indicating loading state.

**Props:**
- `size` (String): Size of the spinner ('small', 'medium', 'large', 'xl')
- `color` (String): Color of the spinner ('accent', 'white', 'primary', 'gray')
- `label` (String): Label to display with the spinner
- `fullScreen` (Boolean): Whether to display the spinner full screen
- `overlay` (Boolean): Whether to display the spinner as an overlay

**Usage:**
```jsx
<LoadingSpinner 
  size="medium"
  color="accent"
  label="Processing image..."
  fullScreen={false}
  overlay={true}
/>
```

### ErrorBoundary

Component for catching and displaying errors.

**Props:**
- `children` (ReactNode): Child components to render
- `resetLabel` (String): Label for the reset button

**Usage:**
```jsx
<ErrorBoundary resetLabel="Try Again">
  <ComponentThatMightError />
</ErrorBoundary>
```

