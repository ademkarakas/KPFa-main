import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { navigateTo } from "../utils/navigation";
import i18n from "../src/i18n/config";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // In production, you could send error to monitoring service
    // Example: sendToErrorMonitoring(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    this.handleReset();
    navigateTo("");
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <AlertTriangle className="text-white" size={32} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {i18n.t("common.errorBoundary.title")}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-slate-600 mb-8">
                  {i18n.t("common.errorBoundary.description")}
                </p>

                {/* Error Details (Development only) */}
                {import.meta.env.DEV && this.state.error && (
                  <details className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
                      {i18n.t("common.errorBoundary.technicalDetails")}
                    </summary>
                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          {i18n.t("common.errorBoundary.error")}
                        </p>
                        <pre className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-x-auto">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">
                            {i18n.t("common.errorBoundary.componentStack")}
                          </p>
                          <pre className="text-xs text-slate-600 bg-slate-100 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => globalThis.location.reload()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw size={20} />
                    {i18n.t("common.errorBoundary.reloadButton")}
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Home size={20} />
                    {i18n.t("common.errorBoundary.homeButton")}
                  </button>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <p className="text-center text-slate-400 text-sm mt-6">
              {i18n.t("common.errorBoundary.supportText")}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
