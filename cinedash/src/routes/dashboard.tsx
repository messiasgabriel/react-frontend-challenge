import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/auth-store';
import {
    discoverMovies,
    fetchPopularMovies,
    searchMovies,
} from '@/entities/movie/api/fetch-movies';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/entities/movie/ui/movie-card';
import { SearchBar } from '@/features/movie-search/ui/search-bar';
import { MovieFilters } from '@/features/movie-filters/ui/movie-filters';
import { useFiltersStore } from '@/features/movie-filters/model/filters-store';

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

    const { genreId, year, minRating } = useFiltersStore();
    const hasFilters = genreId || year || minRating;

    const { data, isLoading } = useQuery({
        queryKey: ['movies', searchQuery, genreId, year, minRating],
        queryFn: () => {
            if (searchQuery) {
                return searchMovies(searchQuery);
            }

            if (hasFilters) {
                return discoverMovies({ genreId, year, minRating });
            }

            return fetchPopularMovies();
        },
    });

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        🎬 CineDash
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">
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
                <h2 className="text-3xl font-bold text-white">
                    {searchQuery
                        ? `Resultados para "${searchQuery}"`
                        : hasFilters
                          ? 'Filmes Filtrados'
                          : 'Filmes Populares'}
                </h2>

                {/* Results count */}
                {data && !isLoading && (
                    <p className="text-slate-400">
                        {data.total_results}{' '}
                        {data.total_results === 1 ? 'resultado' : 'resultados'}
                    </p>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <p className="text-white text-lg">Carregando...</p>
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {data?.results.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-slate-400 text-lg">
                                    Nenhum filme encontrado
                                </p>
                            </div>
                        ) : (
                            data?.results
                                .slice(0, 20)
                                .map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
