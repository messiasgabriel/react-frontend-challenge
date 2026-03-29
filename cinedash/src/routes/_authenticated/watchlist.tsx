import { createFileRoute, Link } from '@tanstack/react-router';
import { useWatchlistStore, WatchlistTable } from '@/features/watchlist';
import { Button } from '@/shared/ui/button';

export const Route = createFileRoute('/_authenticated/watchlist')({
    component: WatchlistPage,
});

export function WatchlistPage() {
    const movies = useWatchlistStore((state) => state.movies);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                    Minha Lista
                </h2>
                <p className="text-muted-foreground">
                    {movies.length} {movies.length === 1 ? 'filme' : 'filmes'}{' '}
                    salvos
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
                    <Link to="/dashboard" search={{ page: 1 }} className="cursor-pointer">
                        <Button>Descobrir Filmes</Button>
                    </Link>
                </div>
            ) : (
                <WatchlistTable />
            )}
        </main>
    );
}
