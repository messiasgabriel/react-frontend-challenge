import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { getImageUrl } from '../lib/get-image-url';
import { useWatchlistStore, type WatchlistMovie } from '@/features/watchlist';
import { toast } from 'sonner';

type MovieCardProps = {
    movie: WatchlistMovie;
};

export function MovieCard({ movie }: MovieCardProps) {
    const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
    const inWatchlist = isInWatchlist(movie.id);

    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    const handleToggleWatchlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWatchlist) {
            removeMovie(movie.id);
            toast.success('Removido da lista', {
                description: `${movie.title} foi removido da sua watchlist`,
            });
        } else {
            addMovie(movie);
            toast.success('Adicionado à lista', {
                description: `${movie.title} foi adicionado à sua watchlist`,
            });
        }
    };

    return (
        <Link to="/movie/$movieId" params={{ movieId: String(movie.id) }}>
            <Card className="group relative overflow-hidden bg-card border-border transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
                {/* Watchlist Button */}
                <Button
                    size="icon"
                    variant={inWatchlist ? 'default' : 'secondary'}
                    className="absolute top-2 right-2 z-10 h-8 w-8"
                    onClick={handleToggleWatchlist}
                >
                    {inWatchlist ? '❤️' : '🤍'}
                </Button>

                <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full aspect-2/3 object-cover"
                />
                <CardContent className="p-3 space-y-2">
                    <h3 className="text-foreground text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-yellow-500 text-sm font-medium">
                            ⭐ {movie.vote_average.toFixed(1)}
                        </p>
                        <p className="text-muted-foreground text-xs">{year}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
