import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { LoginForm } from '@/features/auth/ui/login-form';
import { useAuthStore } from '@/features/auth/model/auth-store';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/login')({
    component: LoginPage,
});

export function LoginPage() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Se já está autenticado, redireciona pro dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: '/dashboard' });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">🎬 CineDash</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Acesse sua conta do CineDash
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground">
                    Qualquer email/senha válidos funcionam (auth simulada)
                </p>
            </div>
        </div>
    );
}
