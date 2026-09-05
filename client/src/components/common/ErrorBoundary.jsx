import React, { Component } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/workspace';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--paper-dim)] flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[var(--rust)] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-[var(--rust)]">
              <AlertOctagon className="w-8 h-8 shrink-0" />
              <h1 className="text-xl font-bold tracking-tight">Something Went Wrong</h1>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              DealFlow360 encountered an unexpected UI rendering error. The error has been captured safely without crashing your session.
            </p>

            {this.state.error && (
              <div className="bg-[var(--rust-tint)] border border-[var(--rust)] p-3 rounded-lg text-xs font-mono text-[var(--rust)] overflow-x-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={this.handleReset}
                className="btn-primary-gold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recover & Return to Workspace</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
