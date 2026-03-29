import { Outlet, Link, useNavigate, useLocation } from '@tanstack/react-router';
import { Film, LayoutDashboard, Bookmark, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { ThemeToggle } from '@/features/theme';
import { Button } from '@/shared/ui/button';
import { Footer } from '@/shared/ui/footer';
import { cn } from '@/shared/lib/utils';

const navItems = [
    { to: '/dashboard' as const, label: 'Descoberta', icon: LayoutDashboard },
    { to: '/watchlist' as const, label: 'Minha Lista', icon: Bookmark },
];

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
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
                    <Link
                        to="/dashboard"
                        className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
                    >
                        <Film className="size-5 text-primary" />
                        <span className="text-xl font-bold tracking-tight">
                            Cine<span className="text-primary">Dash</span>
                        </span>
                    </Link>

                    <nav className="flex items-center gap-0.5">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'relative flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                                    pathname === item.to
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <item.icon className="size-4" />
                                <span className="hidden sm:inline">
                                    {item.label}
                                </span>
                                {pathname === item.to && (
                                    <span className="absolute -bottom-2.25 left-3 right-3 h-px bg-primary" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-1">
                        <ThemeToggle />
                        <span className="mx-2 hidden text-sm text-muted-foreground/60 md:inline">
                            {user?.name}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            aria-label="Sair"
                            className="cursor-pointer text-muted-foreground hover:text-destructive"
                        >
                            <LogOut className="size-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
