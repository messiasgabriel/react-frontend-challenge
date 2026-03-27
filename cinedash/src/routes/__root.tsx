import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { NotFoundPage } from './404';

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFoundPage,
});

export function RootComponent() {
    return (
        <>
            <div className="min-h-screen bg-background">
                <Outlet />
            </div>
            {import.meta.env.DEV && (
                <TanStackRouterDevtools position="bottom-right" />
            )}
        </>
    );
}
