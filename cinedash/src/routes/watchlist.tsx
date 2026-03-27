import {
    createFileRoute,
    redirect,
    useNavigate,
    Link,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/model/auth-store';
import { useWatchlistStore } from '@/features/watchlist/model/watchlist-store';
import { Button } from '@/shared/ui/button';
import { WatchlistTable } from '@/features/watchlist/ui/watchlist-table';
import { ThemeToggle } from '@/features/theme/ui/theme-toggle';

export const Route = createFileRoute('/watchlist')({
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
            });
        }
    },
    component: WatchlistPage,
});

export function WatchlistPage() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const movies = useWatchlistStore((state) => state.movies);

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-foreground">
                            🎬 CineDash
                        </h1>
                        <nav className="flex gap-2">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm">
                                    Descobrir
                                </Button>
                            </Link>
                            <Link to="/watchlist">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-muted"
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

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                        Minha Lista
                    </h2>
                    <p className="text-muted-foreground">
                        {movies.length}{' '}
                        {movies.length === 1 ? 'filme' : 'filmes'} salvos
                    </p>
                </div>

                {movies.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📽️</div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Sua lista está vazia
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Adicione filmes à sua lista para assistir depois
                        </p>
                        <Link to="/dashboard">
                            <Button>Descobrir Filmes</Button>
                        </Link>
                    </div>
                ) : (
                    <WatchlistTable />
                )}
            </main>
        </div>
    );
}
