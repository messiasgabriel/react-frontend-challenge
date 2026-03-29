import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { loginSchema, type LoginFormData } from '../model/auth-schema';
import { useAuthStore } from '../model/auth-store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export function LoginForm() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setSubmitError(null);
        try {
            await login(data);
            navigate({ to: '/dashboard' });
        } catch {
            setSubmitError('Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
                <h1 className="text-5xl font-bold tracking-tight text-foreground">
                    Cine<span className="text-primary">Dash</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Curadoria cinematográfica
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                        E-mail
                    </Label>
                    <Input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        aria-invalid={!!errors.email}
                        className="h-11 border-border/50 bg-card/50 backdrop-blur-sm transition-colors focus:border-primary focus:bg-card"
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Senha
                    </Label>
                    <Input
                        {...register('password')}
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        aria-invalid={!!errors.password}
                        className="h-11 border-border/50 bg-card/50 backdrop-blur-sm transition-colors focus:border-primary focus:bg-card"
                    />
                    {errors.password && (
                        <p className="text-xs text-destructive">{errors.password.message}</p>
                    )}
                </div>

                {submitError && (
                    <p className="text-xs text-destructive text-center">{submitError}</p>
                )}

                <Button
                    type="submit"
                    className="h-11 w-full cursor-pointer text-sm font-medium tracking-wide transition-all hover:shadow-lg hover:shadow-primary/20"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground/60">
                Use qualquer e-mail e senha com 7+ caracteres
            </p>
        </div>
    );
}
