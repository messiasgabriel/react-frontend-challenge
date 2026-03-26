import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPopularMovies } from '@/entities/movie/api/fetch-movies';
import { getImageUrl } from '@/entities/movie/lib/get-image-url';

export const Route = createFileRoute('/')({
    component: HomePage,
});

function HomePage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['movies', 'popular'],
        queryFn: () => fetchPopularMovies(),
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-white text-xl">Carregando filmes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-red-500 text-xl">Erro ao carregar filmes!</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <h1 className="text-4xl font-bold text-white mb-8">
                🎬 Filmes Populares
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {data?.results.slice(0, 10).map((movie) => (
                    <div key={movie.id} className="space-y-2">
                        <img
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            className="w-full rounded-lg"
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
        </div>
    );
}
