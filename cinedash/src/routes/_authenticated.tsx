import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            throw redirect({ to: '/login' });
        }
    },
    component: DashboardLayout,
});
