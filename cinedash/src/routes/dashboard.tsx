import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/model/auth-store';
import { fetchPopularMovies } from '@/entities/movie/api/fetch-movies';
import { getImageUrl } from '@/entities/movie/lib/get-image-url';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

    const { data, isLoading } = useQuery({
        queryKey: ['movies', 'popular'],
        queryFn: () => fetchPopularMovies(),
    });

    const handleLogout = () => {
        logout();
        navigate({ to: '/login' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">🎬 CineDash</h1>
                    <div className="flex items-center gap-4">
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
                <h2 className="text-3xl font-bold mb-6">Filmes Populares</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {data?.results.slice(0, 10).map((movie) => (
                        <Card key={movie.id} className="overflow-hidden">
                            <img
                                src={getImageUrl(movie.poster_path)}
                                alt={movie.title}
                                className="w-full aspect-2/3 object-cover"
                            />
                            <div className="p-3 space-y-2">
                                <h3 className="text-sm font-medium line-clamp-2">
                                    {movie.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    ⭐ {movie.vote_average.toFixed(1)}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
