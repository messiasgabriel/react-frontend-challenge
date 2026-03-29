import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async () => {
        const { isAuthenticated, checkSession } = useAuthStore.getState();

        if (isAuthenticated) {
            await checkSession();
        }

        if (!useAuthStore.getState().isAuthenticated) {
            throw redirect({ to: '/login' });
        }
    },
    component: DashboardLayout,
});
