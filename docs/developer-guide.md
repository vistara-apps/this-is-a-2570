# PixelFlow AI Developer Guide

This guide provides comprehensive information for developers working on the PixelFlow AI application. It covers the architecture, code organization, development workflow, and best practices.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Development Environment Setup](#development-environment-setup)
4. [Key Technologies](#key-technologies)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Subscription Management](#subscription-management)
9. [Image Processing](#image-processing)
10. [Error Handling](#error-handling)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Contributing Guidelines](#contributing-guidelines)

---

## Architecture Overview

PixelFlow AI is a React-based web application that provides AI-powered image editing capabilities. The application follows a client-side architecture with the following key components:

- **Frontend**: React application with Tailwind CSS for styling
- **Backend Services**: Supabase for authentication, database, and storage
- **External APIs**: Integration with various image processing APIs
- **Payment Processing**: Stripe for subscription management

The application uses a context-based state management approach with React Context API, and follows a modular component architecture for maintainability and reusability.

---

## Project Structure

```
pixelflow-ai/
├── docs/                  # Documentation
├── public/                # Public assets
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── subscription/  # Subscription components
│   │   └── ...            # Other components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── models/            # Data models
│   ├── services/          # API service modules
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── supabase/              # Supabase configuration and migrations
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore file
├── index.html             # HTML entry point
├── package.json           # NPM package configuration
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

---

## Development Environment Setup

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later) or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/pixelflow-ai.git
   cd pixelflow-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your API keys and configuration:
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   REACT_APP_PERFECTCORP_API_KEY=your-perfectcorp-api-key
   REACT_APP_APYHUB_API_KEY=your-apyhub-api-key
   REACT_APP_OPENAI_API_KEY=your-openai-api-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

---

## Key Technologies

### Frontend

- **React**: JavaScript library for building user interfaces
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend

- **Supabase**: Backend-as-a-Service for authentication, database, and storage
- **Stripe**: Payment processing and subscription management

### External APIs

- **Perfect Corp. YouCam Online Editor API**: Core image editing capabilities
- **ApyHub Image Filter API**: Artistic filters and adjustments
- **OpenAI DALL-E 3 API**: Image generation and advanced editing

---

## State Management

The application uses React Context API for state management. The main context providers are:

- **AuthContext**: Manages user authentication state
- **EditorContext**: Manages image editing state
- **SettingsContext**: Manages application settings

### AuthContext

The `AuthContext` provides authentication state and methods for the entire application. It handles user sign-up, sign-in, sign-out, and profile management.

```jsx
// Example usage
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, signIn, signOut, isAuthenticated } = useAuth();
  
  // Use authentication state and methods
}
```

### EditorContext

The `EditorContext` provides image editing state and methods. It handles image upload, adjustments, AI tools, and export.

```jsx
// Example usage
import { useEditor } from '../context/EditorContext';

function MyComponent() {
  const { 
    currentImage, 
    applyAdjustments, 
    removeBackground, 
    exportImage 
  } = useEditor();
  
  // Use editor state and methods
}
```

---

## API Integration

The application integrates with several external APIs for image processing and other functionality. These integrations are handled by service modules in the `src/services` directory.

### Service Modules

- **perfectCorpService.js**: Integration with Perfect Corp. YouCam Online Editor API
- **apyHubService.js**: Integration with ApyHub Image Filter API
- **openaiService.js**: Integration with OpenAI DALL-E 3 API
- **supabaseService.js**: Integration with Supabase for authentication, database, and storage
- **stripeService.js**: Integration with Stripe for payment processing

### Example: Using a Service Module

```jsx
import { perfectCorpService } from '../services';

async function removeImageBackground(imageFile) {
  try {
    const processedImage = await perfectCorpService.removeBackground(imageFile);
    return processedImage;
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
}
```

---

## Authentication and Authorization

The application uses Supabase for authentication and authorization. The authentication flow is handled by the `AuthContext` and the `supabaseService` module.

### Authentication Flow

1. User signs up or logs in using the authentication components
2. Supabase authenticates the user and returns a session
3. The session is stored in the `AuthContext`
4. The application uses the session for authenticated API requests

### Protected Routes

The application uses a `ProtectedRoute` component to restrict access to authenticated users and users with specific subscription tiers.

```jsx
// Example usage
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route 
        path="/premium-feature" 
        element={
          <ProtectedRoute requiredTier="premium">
            <PremiumFeature />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

---

## Subscription Management

The application uses Stripe for subscription management. The subscription flow is handled by the `SubscriptionManager` component and the `stripeService` module.

### Subscription Flow

1. User selects a subscription plan
2. Application creates a Stripe checkout session
3. User is redirected to Stripe checkout
4. After successful payment, user is redirected back to the application
5. Application verifies the payment and updates the user's subscription tier

### Subscription Tiers

The application supports three subscription tiers:

- **Free**: Limited features and usage
- **Pro**: Enhanced features and unlimited usage
- **Premium**: All features and unlimited usage

---

## Image Processing

The application provides various image processing capabilities through external APIs and client-side processing. The image processing logic is handled by the `imageProcessing` utility module and the `useImageProcessing` hook.

### Image Processing Flow

1. User uploads an image
2. Image is stored in Supabase storage
3. User applies adjustments or AI tools
4. Application processes the image using external APIs or client-side processing
5. Processed image is stored in Supabase storage
6. User can export or share the processed image

### Client-Side Processing

For basic adjustments, the application uses client-side processing with the Canvas API. This allows for real-time preview of adjustments without making API requests.

```jsx
// Example: Applying filters using Canvas API
function applyFilters(image, adjustments) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = image.width;
  canvas.height = image.height;
  
  // Apply filters
  const filterString = [
    `brightness(${100 + adjustments.brightness}%)`,
    `contrast(${100 + adjustments.contrast}%)`,
    `saturate(${100 + adjustments.saturation}%)`
  ].join(' ');
  
  ctx.filter = filterString;
  ctx.drawImage(image, 0, 0);
  
  return canvas.toDataURL();
}
```

---

## Error Handling

The application uses a comprehensive error handling approach with custom hooks and utility functions. The error handling logic is handled by the `useError` hook and the `errorReporting` utility module.

### Error Handling Flow

1. Application attempts an operation
2. If an error occurs, it is caught and handled by the `useError` hook
3. The error is logged and reported to the error reporting service
4. The user is notified of the error with a user-friendly message

### Error Boundary

The application uses an `ErrorBoundary` component to catch and handle errors in React components.

```jsx
// Example usage
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MainApplication />
    </ErrorBoundary>
  );
}
```

---

## Testing

The application uses Jest and React Testing Library for testing. Tests are organized in a `__tests__` directory next to the code they test.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

```
src/
├── components/
│   ├── Button.jsx
│   └── __tests__/
│       └── Button.test.jsx
├── hooks/
│   ├── useAuth.js
│   └── __tests__/
│       └── useAuth.test.js
```

---

## Deployment

The application is deployed using a CI/CD pipeline with GitHub Actions. The deployment process is automated and triggered by pushes to the main branch.

### Deployment Flow

1. Developer pushes changes to the main branch
2. GitHub Actions runs tests and builds the application
3. If tests pass, the application is deployed to the production environment
4. If tests fail, the deployment is aborted and the developer is notified

### Environment Variables

The application uses environment variables for configuration. These variables are set in the CI/CD pipeline and are not committed to the repository.

```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_PERFECTCORP_API_KEY=your-perfectcorp-api-key
REACT_APP_APYHUB_API_KEY=your-apyhub-api-key
REACT_APP_OPENAI_API_KEY=your-openai-api-key
```

---

## Contributing Guidelines

### Code Style

The application follows the Airbnb JavaScript Style Guide. Code style is enforced using ESLint and Prettier.

```bash
# Run ESLint
npm run lint

# Run Prettier
npm run format
```

### Commit Messages

The application follows the Conventional Commits specification for commit messages.

```
feat: add new feature
fix: fix bug
docs: update documentation
style: update code style
refactor: refactor code
test: add tests
chore: update build process
```

### Pull Requests

1. Create a new branch from the main branch
2. Make your changes
3. Run tests and linting
4. Push your changes to the remote branch
5. Create a pull request
6. Wait for code review and CI/CD checks
7. Address any feedback
8. Merge the pull request

