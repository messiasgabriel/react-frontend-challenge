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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        // Simular delay de autenticação
        await new Promise((resolve) => setTimeout(resolve, 500));

        login(data.email, data.password);
        navigate({ to: '/dashboard' });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                    <p className="text-sm text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                    {...register('password')}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
        </form>
    );
}
