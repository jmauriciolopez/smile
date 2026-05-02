import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary
 * Componente de clase (necesario para catch en React) que captura errores
 * en su árbol de componentes hijos.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de repuesto.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload(); // Opción más segura para limpiar estados corruptos de WebGL/WASM
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center animate-in fade-in zoom-in duration-300">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-xl font-bold text-slate-800">
            Ups, algo no salió como esperábamos
          </h2>
          <p className="mb-8 max-w-md text-sm text-slate-500 leading-relaxed">
            Se produjo un error inesperado en el motor del editor. Esto puede
            deberse a un problema temporal con el acelerador gráfico o la carga
            de modelos de IA.
          </p>
          {this.state.error && (
            <div className="mb-8 max-w-lg overflow-x-auto rounded-xl bg-slate-900 p-4 text-left font-mono text-[10px] text-red-400 shadow-lg">
              <p className="font-bold uppercase text-slate-500 mb-1 tracking-widest">
                Error Log:
              </p>
              {this.state.error.toString()}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95"
            >
              🔄 Reiniciar Editor
            </button>
            <button
              onClick={() => window.history.back()}
              className="rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              🔙 Volver al Caso
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
