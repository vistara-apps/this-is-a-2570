import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also log the error to a reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
          <div className="glass-panel rounded-xl p-6 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/20 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-heading text-white mb-2">Something went wrong</h2>
            
            <p className="text-white/70 mb-6">
              We're sorry, but an error occurred while rendering this component.
            </p>
            
            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 text-left">
                <div className="bg-black/30 p-4 rounded-lg overflow-auto max-h-40 mb-4">
                  <p className="text-red-400 text-sm font-mono">
                    {this.state.error && this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-white/70 text-sm cursor-pointer">Stack trace</summary>
                      <pre className="text-white/50 text-xs mt-2 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {this.props.resetLabel && (
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg py-2.5 px-5"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {this.props.resetLabel}
                </button>
              )}
              
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center bg-accent hover:bg-accent/90 text-white font-medium rounded-lg py-2.5 px-5"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;

