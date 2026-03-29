import { createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryProvider } from '@/app/providers/query-provider';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { RootLayout } from '@/app/layouts/root-layout';
import { NotFoundPage } from './404';

export interface RouterContext {
    isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <QueryProvider>
            <ThemeProvider>
                <RootLayout />
                <TanStackRouterDevtools />
            </ThemeProvider>
        </QueryProvider>
    ),
    notFoundComponent: NotFoundPage,
});
