import { Component, ReactNode } from 'react';
import { ErrorFallback } from './error-fallback';

type ErrorBoundaryProps = {
    children: ReactNode;
    onReset?: () => void;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: unknown) {
        console.error('ErrorBoundary caught error:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError && this.state.error) {
            return (
                <ErrorFallback
                    error={this.state.error}
                    resetError={this.resetError}
                />
            );
        }

        return this.props.children;
    }
}
