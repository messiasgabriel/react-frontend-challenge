import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
    movieDetailQueryOptions,
    MovieDetailView,
    MovieCast,
    MovieTrailer,
} from '@/entities/movie';
import { WatchlistToggle } from '@/features/watchlist';

export const Route = createFileRoute('/_authenticated/movie/$movieId')({
    component: MovieDetailPage,
});

export function MovieDetailPage() {
    const { movieId } = Route.useParams();
    const navigate = useNavigate();
    const id = Number(movieId);

    const {
        data: movie,
        isLoading,
        isError,
        refetch,
    } = useQuery(movieDetailQueryOptions(id));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    <ArrowLeft className="size-4" />
                    Voltar
                </Button>

                {isLoading && (
                    <div className="space-y-6 animate-pulse">
                        <div className="grid gap-8 md:grid-cols-[auto_1fr]">
                            <div className="w-full md:w-80 aspect-2/3 bg-muted rounded-xl" />
                            <div className="space-y-4">
                                <div className="h-12 bg-muted rounded w-2/3" />
                                <div className="h-6 bg-muted rounded w-1/3" />
                                <div className="h-24 bg-muted rounded" />
                            </div>
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col items-center gap-4 py-16">
                        <p className="text-xl text-muted-foreground">
                            Erro ao carregar detalhes
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            className="cursor-pointer"
                        >
                            Tentar novamente
                        </Button>
                    </div>
                )}

                {movie && (
                    <>
                        <MovieDetailView
                            movie={movie}
                            action={<WatchlistToggle movie={movie} showLabel />}
                        />
                        <MovieCast movieId={id} />
                        <MovieTrailer movieId={id} />
                    </>
                )}
            </div>
        </div>
    );
}
