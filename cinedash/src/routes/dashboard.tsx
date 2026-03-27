import {
    createFileRoute,
    Link,
    redirect,
    useNavigate,
} from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/model/auth-store';
import {
    fetchPopularMovies,
    searchMovies,
    discoverMovies,
} from '@/entities/movie/api/fetch-movies';
import { useFiltersStore } from '@/features/movie-filters/model/filters-store';
import { Button } from '@/shared/ui/button';
import { MovieCard } from '@/entities/movie/ui/movie-card';
import { SearchBar } from '@/features/movie-search/ui/search-bar';
import { MovieFilters } from '@/features/movie-filters/ui/movie-filters';
import { MovieCardSkeleton } from '@/entities/movie/ui/movie-card-skeleton';
import { ThemeToggle } from '@/features/theme/ui/theme-toggle';

export const Route = createFileRoute('/dashboard')({
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
            });
        }
    },
    component: DashboardPage,
});

export function DashboardPage() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
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

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

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
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-muted"
                                >
                                    Descobrir
                                </Button>
                            </Link>
                            <Link to="/watchlist">
                                <Button variant="ghost" size="sm">
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
                                    <MovieCard key={movie.id} movie={movie} />
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
        </div>
    );
}
