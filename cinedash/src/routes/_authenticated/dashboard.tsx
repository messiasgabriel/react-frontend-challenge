import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { MovieCard, MovieCardSkeleton } from '@/entities/movie';
import type { Movie } from '@/entities/movie';
import { MovieFilters } from '@/features/movie-filters';
import { SearchBar } from '@/features/movie-search';
import { WatchlistToggle } from '@/features/watchlist';
import { Button } from '@/shared/ui/button';
import { Pagination } from '@/shared/ui/pagination';
import { useMoviesQuery } from './hooks/-use-movies-query';

const searchSchema = z.object({
    page: z.number().int().positive().optional().default(1),
});

export const Route = createFileRoute('/_authenticated/dashboard')({
    validateSearch: searchSchema,
    component: DashboardPage,
});

function MoviesGrid({
    movies,
    isLoading,
}: {
    movies: Movie[];
    isLoading: boolean;
}) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <MovieCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="py-16 text-center">
                <p className="text-xl text-muted-foreground">
                    Nenhum filme encontrado
                </p>
                <p className="mt-1 text-sm text-muted-foreground/60">
                    Tente ajustar sua busca ou filtros.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    action={<WatchlistToggle movie={movie} />}
                />
            ))}
        </div>
    );
}

export function DashboardPage() {
    const { page } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const {
        movies,
        totalPages,
        isLoading,
        isError,
        refetch,
        title,
        isSearching,
    } = useMoviesQuery(page);

    function setPage(newPage: number) {
        navigate({ search: { page: newPage } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>

            <div className="flex justify-center">
                <SearchBar />
            </div>

            {!isSearching && <MovieFilters />}

            {isError && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                    <p className="text-lg text-muted-foreground">
                        Erro ao carregar filmes
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

            {!isError && <MoviesGrid movies={movies} isLoading={isLoading} />}

            {!isLoading && !isError && movies.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </main>
    );
}
