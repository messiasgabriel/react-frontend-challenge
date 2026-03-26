import { createFileRoute, redirect } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/model/auth-store';
import { fetchPopularMovies } from '@/entities/movie/api/fetch-movies';
import { getImageUrl } from '@/entities/movie/lib/get-image-url';

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

function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const { data, isLoading } = useQuery({
        queryKey: ['movies', 'popular'],
        queryFn: () => fetchPopularMovies(),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-white text-xl">Carregando...</p>
            </div>
        );
    }

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
                        <button
                            onClick={() => {
                                logout();
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                    Filmes Populares
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {data?.results.slice(0, 10).map((movie) => (
                        <div key={movie.id} className="space-y-2">
                            <img
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                className="w-full rounded-lg shadow-lg"
                            />
                            <h3 className="text-white text-sm font-medium line-clamp-2">
                                {movie.title}
                            </h3>
                            <p className="text-yellow-500 text-sm">
                                ⭐ {movie.vote_average.toFixed(1)}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
