import { Component, type ErrorInfo, type ReactNode } from "react";
import { GlassPanel } from "@/shared/components/atoms/GlassPanel";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-[#050b15] text-slate-800 dark:text-slate-100 p-4">
          <GlassPanel className="p-8 max-w-lg w-full text-center">
            <h1 className="text-2xl font-black mb-4 text-red-600">
              CRITICAL FAILURE
            </h1>
            <p className="mb-6 text-slate-600 dark:text-slate-300">
              The game engine has encountered an unexpected error.
            </p>
            <div className="bg-slate-100 dark:bg-black/30 p-4 rounded-xl mb-6 text-left overflow-auto max-h-32 text-xs font-mono">
              {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Reboot System
            </button>
          </GlassPanel>
        </div>
      );
    }

    return this.props.children;
  }
}
