import { Outlet, Link, useNavigate, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth';
import { ThemeToggle } from '@/features/theme';
import { Button } from '@/shared/ui/button';
import { Footer } from '@/shared/ui/footer';

export function DashboardLayout() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-foreground">
                            🎬 CineDash
                        </h1>
                        <nav className="flex gap-2">
                            <Link to="/dashboard" className="cursor-pointer">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={
                                        pathname === '/dashboard'
                                            ? 'bg-muted'
                                            : ''
                                    }
                                >
                                    Descobrir
                                </Button>
                            </Link>
                            <Link to="/watchlist" className="cursor-pointer">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={
                                        pathname === '/watchlist'
                                            ? 'bg-muted'
                                            : ''
                                    }
                                >
                                    Minha Lista
                                </Button>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <span className="text-muted-foreground text-sm">
                            {user?.email}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </div>
                </div>
            </header>
            <Outlet />
            <Footer />
        </div>
    );
}
