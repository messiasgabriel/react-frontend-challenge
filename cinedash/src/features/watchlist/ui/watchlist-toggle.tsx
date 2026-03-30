import { Bookmark, BookmarkCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { WatchlistMovie } from '@/entities/movie';
import { toWatchlistMovie } from '@/entities/movie';
import { useWatchlistStore } from '../model/watchlist-store';
import { Button } from '@/shared/ui/button';

type MovieLike = WatchlistMovie & {
    genres?: { id: number; name: string }[];
};

type WatchlistToggleProps = {
    movie: MovieLike;
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
            toast('Removido da lista', {
                description: `${movie.title} foi removido da sua lista`,
                icon: <XCircle className="size-4 text-destructive" />,
            });
        } else {
            addMovie(toWatchlistMovie(movie));
            toast.success('Adicionado à lista', {
                description: `${movie.title} foi adicionado à sua lista`,
            });
        }
    };

    const ariaLabel = inWatchlist
        ? `Remover ${movie.title} da lista`
        : `Adicionar ${movie.title} à lista`;

    return (
        <Button
            variant={inWatchlist ? 'default' : 'secondary'}
            size={showLabel ? 'default' : 'icon'}
            aria-label={ariaLabel}
            aria-pressed={inWatchlist}
            className={
                showLabel ? 'gap-2 cursor-pointer' : 'h-8 w-8 cursor-pointer'
            }
            onClick={handleToggle}
        >
            {inWatchlist ? (
                <BookmarkCheck className="size-4" aria-hidden="true" />
            ) : (
                <Bookmark className="size-4" aria-hidden="true" />
            )}
            {showLabel && (inWatchlist ? 'Na lista' : 'Adicionar à lista')}
        </Button>
    );
}
