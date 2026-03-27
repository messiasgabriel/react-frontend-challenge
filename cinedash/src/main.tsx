import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Providers } from './app/providers/query-provider.tsx';
import { Toaster } from './shared/ui/sonner.tsx';
import './globals.css';

// Import das rotas geradas automaticamente
import { routeTree } from './routeTree.gen.ts';

// Criar router
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
});

// Registrar tipos do router (ts)
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <RouterProvider router={router} />
            <Toaster
                richColors
                position="bottom-right"
                toastOptions={{
                    className: '!bg-card !text-card-foreground !border-border',
                }}
            />
        </Providers>
    </StrictMode>,
);
