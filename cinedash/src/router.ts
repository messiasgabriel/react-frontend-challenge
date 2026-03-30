import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import type { RouterContext } from './routes/__root';
import { queryClient } from './app/providers/query-provider';

export const router = createRouter({
    routeTree,
    context: {
        isAuthenticated: false,
        queryClient,
    } satisfies RouterContext,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
