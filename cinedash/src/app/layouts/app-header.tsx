import { Link, useNavigate, useLocation } from '@tanstack/react-router';
import { Film, LayoutDashboard, Bookmark, LogOut, LogIn } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { ThemeToggle } from '@/features/theme';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

const navItems = [
    { to: '/dashboard' as const, search: { page: 1 }, label: 'Descoberta', icon: LayoutDashboard },
    { to: '/watchlist' as const, label: 'Minha Lista', icon: Bookmark },
];

export function AppHeader() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = () => {
        logout();
        navigate({ to: '/' });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
            >
                Ir para o conteúdo principal
            </a>

            <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
                <Link
                    to="/"
                    aria-label="CineDash — Página inicial"
                    className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                    <Film className="size-5 text-primary" aria-hidden="true" />
                    <span className="text-xl font-bold tracking-tight">
                        Cine<span className="text-primary">Dash</span>
                    </span>
                </Link>

                {isAuthenticated && (
                    <nav aria-label="Navegação principal" className="flex items-center gap-0.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    search={'search' in item ? item.search : undefined}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                        'relative flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                        isActive
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    <item.icon className="size-4" aria-hidden="true" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                    {isActive && (
                                        <span className="absolute -bottom-2.25 left-3 right-3 h-px bg-primary" aria-hidden="true" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                <div className="ml-auto flex items-center gap-1">
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <>
                            <span className="mx-2 hidden text-sm text-muted-foreground/60 md:inline" aria-hidden="true">
                                {user?.name}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                aria-label={`Sair da conta de ${user?.name ?? 'usuário'}`}
                                className="cursor-pointer text-muted-foreground hover:text-destructive"
                            >
                                <LogOut className="size-4" aria-hidden="true" />
                            </Button>
                        </>
                    ) : (
                        <Button asChild size="sm" className="gap-2 cursor-pointer">
                            <Link to="/login" search={{ redirect: pathname }}>
                                <LogIn className="size-4" aria-hidden="true" />
                                Entrar
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
