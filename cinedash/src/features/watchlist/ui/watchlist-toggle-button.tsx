import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { useWatchlistStore, type WatchlistMovie } from '../model/watchlist-store';

type WatchlistToggleButtonProps = {
    movie: WatchlistMovie;
};

export function WatchlistToggleButton({ movie }: WatchlistToggleButtonProps) {
    const { addMovie, removeMovie, isInWatchlist } = useWatchlistStore();
    const inWatchlist = isInWatchlist(movie.id);

    const handleToggle = (e: React.MouseEvent) => {
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
        <Button
            size="icon"
            variant={inWatchlist ? 'default' : 'secondary'}
            className="h-8 w-8"
            onClick={handleToggle}
        >
            {inWatchlist ? '❤️' : '🤍'}
        </Button>
    );
}
