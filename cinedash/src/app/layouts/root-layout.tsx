import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Toaster } from '@/shared/ui/sonner';
import { Footer } from '@/shared/ui/footer';

export function RootLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Outlet />
            <Footer />
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
