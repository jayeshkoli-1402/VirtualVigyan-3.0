import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    console.error('[VirtualVigyan] Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('vv_active_user');
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0c0f17',
            color: '#f8fafc',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: 500,
              background: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              padding: '36px 28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚗️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, color: '#38bdf8' }}>
              VirtualVigyan Laboratory
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
              The laboratory encountered an unexpected state. Click below to safely restore and reload the session.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 28px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              Reload Laboratory ↻
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
