import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Clapperboard } from 'lucide-react';
import { useWatchlistStore, WatchlistTable } from '@/features/watchlist';
import { Button } from '@/shared/ui/button';

export const Route = createFileRoute('/_authenticated/watchlist')({
    component: WatchlistPage,
});

export function WatchlistPage() {
    const movies = useWatchlistStore((state) => state.movies);
    const router = useRouter();

    return (
        <main id="main-content" className="container mx-auto px-4 space-y-8 flex-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.history.back()}
                className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
                <ArrowLeft className="size-4" />
                Voltar
            </Button>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Minha Lista
                </h1>
                <p className="text-muted-foreground">
                    {movies.length} {movies.length === 1 ? 'filme' : 'filmes'}{' '}
                    salvos
                </p>
            </div>

            {movies.length === 0 ? (
                <div className="text-center py-12">
                    <div className="flex justify-center mb-4 text-muted-foreground">
                        <Clapperboard
                            className="size-16 opacity-40"
                            aria-hidden="true"
                        />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Sua lista está vazia
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Adicione filmes à sua lista para assistir depois
                    </p>
                    <Link
                        to="/dashboard"
                        search={{ page: 1 }}
                        className="cursor-pointer"
                    >
                        <Button>Descobrir Filmes</Button>
                    </Link>
                </div>
            ) : (
                <WatchlistTable />
            )}
        </main>
    );
}
