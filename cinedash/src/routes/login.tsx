import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginForm } from '@/features/auth';
import { AuthLayout } from '@/app/layouts/auth-layout';

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional(),
    }),
    beforeLoad: ({ context }) => {
        if (context.isAuthenticated) {
            throw redirect({ to: '/dashboard', search: { page: 1 } });
        }
    },
    component: LoginPage,
});

export function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
