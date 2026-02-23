import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertOctagon } from "lucide-react";
import { DesertIcon } from "@/client/game/components/atoms/UnitIcons";

interface Props {
  children?: ReactNode;
  fullScreen?: boolean;
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
      const fullScreen = this.props.fullScreen ?? true;
      return (
        <div
          className={`min-h-[100vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 ${
            fullScreen
              ? "w-full h-full"
              : "w-full h-full p-4 shadow-inner rounded-3xl"
          }`}
        >
          <DesertIcon className="w-12 h-12 text-slate-400 opacity-50" />
          <div className="mt-8 text-center font-black uppercase tracking-widest text-slate-400">
            <div className="flex justify-center items-center mb-6">
              <AlertOctagon className="w-16 h-16 text-brand-red opacity-80" />
            </div>

            <div className="text-2xl mb-2 text-slate-600 dark:text-slate-300">
              System Failure
            </div>

            <div className="text-sm opacity-60 mb-6 max-w-md mx-auto normal-case tracking-normal px-4">
              The game engine has encountered an unexpected error.
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-200 dark:bg-black/30 p-4 rounded-xl mb-8 text-left overflow-auto max-h-32 text-xs font-mono normal-case tracking-normal max-w-lg mx-auto text-slate-600 dark:text-slate-400">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
