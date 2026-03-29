import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth';
import { AuthLayout } from '@/app/layouts/auth-layout';

export const Route = createFileRoute('/login')({
    beforeLoad: ({ context }) => {
        if (context.isAuthenticated) {
            throw redirect({ to: '/dashboard' });
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
