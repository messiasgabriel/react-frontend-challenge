import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { WatchlistMovie } from '@/entities/movie';
import { useWatchlistStore } from '../model/watchlist-store';
import { Button } from '@/shared/ui/button';

type WatchlistToggleProps = {
    movie: WatchlistMovie;
    showLabel?: boolean;
};

export function WatchlistToggle({ movie, showLabel }: WatchlistToggleProps) {
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
            variant={inWatchlist ? 'default' : 'secondary'}
            size={showLabel ? 'default' : 'icon'}
            className={showLabel ? 'gap-2 cursor-pointer' : 'h-8 w-8 cursor-pointer'}
            onClick={handleToggle}
        >
            {inWatchlist ? (
                <BookmarkCheck className="size-4" />
            ) : (
                <Bookmark className="size-4" />
            )}
            {showLabel && (inWatchlist ? 'Na lista' : 'Adicionar à lista')}
        </Button>
    );
}
