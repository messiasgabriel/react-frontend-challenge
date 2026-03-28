import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
    fetchPopularMovies,
    searchMovies,
    discoverMovies,
    MovieCard,
    MovieCardSkeleton,
} from '@/entities/movie';
import { useFiltersStore, MovieFilters } from '@/features/movie-filters';
import { SearchBar } from '@/features/movie-search';
import { WatchlistToggleButton } from '@/features/watchlist';
import { Button } from '@/shared/ui/button';

export const Route = createFileRoute('/_authenticated/dashboard')({
    component: DashboardPage,
});

export function DashboardPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    const { genreId, year, minRating } = useFiltersStore();
    const hasFilters = genreId || year || minRating;

    const { data, isLoading } = useQuery({
        queryKey: ['movies', searchQuery, genreId, year, minRating, page],
        queryFn: () => {
            if (searchQuery) {
                return searchMovies(searchQuery, page);
            }

            if (hasFilters) {
                return discoverMovies({ genreId, year, minRating, page });
            }

            return fetchPopularMovies(page);
        },
    });

    const handleSearch = useCallback((query: string) => {
        if (query.trim().length >= 3 || query === '') {
            setSearchQuery(query);
            setPage(1);
        }
    }, []);

    const handleNextPage = () => {
        if (data && page < data.total_pages) {
            setPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const canGoNext = data && page < data.total_pages;
    const canGoPrev = page > 1;

    return (
        <main className="container mx-auto px-4 py-8 space-y-8">
            {/* Search */}
            <div className="flex justify-center">
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Filters */}
            {!searchQuery && <MovieFilters />}

            {/* Title */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">
                    {searchQuery
                        ? `Resultados para "${searchQuery}"`
                        : hasFilters
                          ? 'Filmes Filtrados'
                          : 'Filmes Populares'}
                </h2>
                {data && !isLoading && (
                    <p className="text-muted-foreground text-sm">
                        Página {page} de {data.total_pages}
                    </p>
                )}
            </div>

            {/* Results count */}
            {data && !isLoading && (
                <p className="text-muted-foreground">
                    {data.total_results}{' '}
                    {data.total_results === 1 ? 'resultado' : 'resultados'}
                </p>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {/* Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {data?.results.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-muted-foreground text-lg">
                                    Nenhum filme encontrado
                                </p>
                            </div>
                        ) : (
                            data?.results.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    action={<WatchlistToggleButton movie={movie} />}
                                />
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {data && data.results.length > 0 && (
                        <div className="flex items-center justify-center gap-4 pt-8">
                            <Button
                                variant="outline"
                                onClick={handlePrevPage}
                                disabled={!canGoPrev}
                            >
                                ← Anterior
                            </Button>

                            <span className="text-muted-foreground text-sm">
                                Página {page} de {data.total_pages}
                            </span>

                            <Button
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={!canGoNext}
                            >
                                Próxima →
                            </Button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
