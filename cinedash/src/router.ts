import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import type { RouterContext } from './routes/__root';

export const router = createRouter({
    routeTree,
    context: {
        isAuthenticated: false,
    } satisfies RouterContext,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
