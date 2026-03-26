import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { LoginForm } from '@/features/auth/ui/login-form';
import { useAuthStore } from '@/features/auth/model/auth-store';

export const Route = createFileRoute('/login')({
    component: LoginPage,
});

function LoginPage() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Se já está autenticado, redireciona pro dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: '/dashboard' });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        🎬 CineDash
                    </h1>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Login
                    </h2>
                    <p className="text-slate-400">
                        Acesse sua conta do CineDash
                    </p>
                </div>

                <div className="bg-slate-900 p-8 rounded-lg shadow-xl">
                    <LoginForm />
                </div>

                <p className="mt-4 text-center text-sm text-slate-400">
                    Qualquer email/senha válidos funcionam (auth simulada)
                </p>
            </div>
        </div>
    );
}
