import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/model/auth-store';
import {
    fetchMovieDetails,
    fetchMovieCredits,
    fetchMovieVideos,
} from '@/entities/movie/api/fetch-movies';
import { useWatchlistStore } from '@/features/watchlist/model/watchlist-store';
import { getImageUrl } from '@/entities/movie/lib/get-image-url';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/movie/$movieId')({
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
            });
        }
    },
    component: MovieDetailPage,
});

export function MovieDetailPage() {
    const { movieId } = Route.useParams();
    const navigate = useNavigate();
    const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();

    const { data: movie, isLoading: isLoadingMovie } = useQuery({
        queryKey: ['movie', 'details', movieId],
        queryFn: () => fetchMovieDetails(Number(movieId)),
    });

    const { data: credits } = useQuery({
        queryKey: ['movie', 'credits', movieId],
        queryFn: () => fetchMovieCredits(Number(movieId)),
        enabled: !!movie,
    });

    const { data: videos } = useQuery({
        queryKey: ['movie', 'videos', movieId],
        queryFn: () => fetchMovieVideos(Number(movieId)),
        enabled: !!movie,
    });

    if (isLoadingMovie) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-white text-xl">Carregando...</p>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <p className="text-white text-xl">Filme não encontrado</p>
            </div>
        );
    }

    const inWatchlist = isInWatchlist(movie.id);
    const trailer = videos?.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube',
    );
    const cast = credits?.cast.slice(0, 10) || [];

    const handleToggleWatchlist = () => {
        if (inWatchlist) {
            removeMovie(movie.id);
        } else {
            addMovie(movie);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate({ to: '/dashboard' })}
                    >
                        ← Voltar
                    </Button>
                    <h1 className="text-xl font-bold text-white">
                        Detalhes do Filme
                    </h1>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-8">
                    {/* Poster */}
                    <div>
                        <img
                            src={getImageUrl(movie.poster_path, 'w500')}
                            alt={movie.title}
                            className="w-full rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {movie.title}
                            </h1>
                            {movie.tagline && (
                                <p className="text-slate-400 italic">
                                    {movie.tagline}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500 text-2xl">
                                    ⭐
                                </span>
                                <span className="text-white text-xl font-semibold">
                                    {movie.vote_average.toFixed(1)}
                                </span>
                            </div>
                            <span className="text-slate-400">
                                {new Date(movie.release_date).getFullYear()}
                            </span>
                            <span className="text-slate-400">
                                {movie.runtime} min
                            </span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {movie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleToggleWatchlist}
                                className="gap-2"
                            >
                                {inWatchlist
                                    ? '❤️ Na Lista'
                                    : '🤍 Adicionar à Lista'}
                            </Button>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleToggleWatchlist}
                                    className="gap-2"
                                >
                                    {inWatchlist
                                        ? '❤️ Na Lista'
                                        : '🤍 Adicionar à Lista'}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Sinopse
                            </h2>
                            <p className="text-slate-300 leading-relaxed">
                                {movie.overview}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Trailer */}
                {trailer && (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-3">
                            Trailer
                        </h2>
                        <div
                            className="relative w-full rounded-lg overflow-hidden"
                            style={{ paddingBottom: '56.25%' }}
                        >
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title={`${movie.title} - Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
                {/* Cast */}
                {cast.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Elenco Principal
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {cast.map((actor) => (
                                <Card
                                    key={actor.id}
                                    className="bg-slate-900 border-slate-800"
                                >
                                    <CardContent className="p-4 text-center">
                                        {actor.profile_path ? (
                                            <img
                                                src={getImageUrl(
                                                    actor.profile_path,
                                                    'w185',
                                                )}
                                                alt={actor.name}
                                                className="w-full aspect-2/3 object-cover rounded-lg mb-2"
                                            />
                                        ) : (
                                            <div className="w-full aspect-2/3 bg-slate-800 rounded-lg mb-2 flex items-center justify-center">
                                                <span className="text-4xl">
                                                    👤
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-white font-medium text-sm">
                                            {actor.name}
                                        </p>
                                        <p className="text-slate-400 text-xs">
                                            {actor.character}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
