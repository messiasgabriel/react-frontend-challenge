import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Toaster } from '@/shared/ui/sonner';

export function RootLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Outlet />
            <Toaster
                richColors
                position="bottom-right"
                toastOptions={{
                    className: '!bg-card !text-card-foreground !border-border',
                }}
            />
            {import.meta.env.DEV && (
                <TanStackRouterDevtools position="bottom-right" />
            )}
        </div>
    );
}
