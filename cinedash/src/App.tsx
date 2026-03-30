import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { useAuthStore } from '@/features/auth';
import { queryClient } from '@/app/providers/query-provider';
import { Skeleton } from '@/shared/ui/skeleton';

function App() {
    const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
        );
    }

    return (
        <RouterProvider
            router={router}
            context={{ isAuthenticated, queryClient }}
        />
    );
}

export default App;
