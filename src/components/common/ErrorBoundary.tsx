import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro na aplicação Silvia Ateliê:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-[#E8D8DF] text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F3EBF0] text-[#7A5268] flex items-center justify-center text-2xl font-bold">
              🌸
            </div>
            <h1 className="text-xl font-bold text-[#292529] mb-2">
              Silvia Ateliê
            </h1>
            <p className="text-sm text-[#777277] mb-6 leading-relaxed">
              Ocorreu uma instabilidade momentânea ao carregar a página. Você pode recarregar ou restaurar o estado inicial.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-2.5 bg-[#7A5268] hover:bg-[#684357] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-[#7A5268]/20"
              >
                Recarregar página
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#777277] text-xs font-medium rounded-xl transition-all cursor-pointer"
              >
                Restaurar dados iniciais do ateliê
              </button>
            </div>

            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-[11px] text-stone-400 cursor-pointer">
                  Detalhes técnicos do erro
                </summary>
                <pre className="mt-2 p-2 bg-stone-50 rounded-lg text-[10px] text-stone-600 overflow-x-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
