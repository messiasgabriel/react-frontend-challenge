import { Bookmark, BookmarkCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { WatchlistMovie } from '@/entities/movie';
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
            const normalized: WatchlistMovie = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                genre_ids: movie.genre_ids?.length
                    ? movie.genre_ids
                    : (movie.genres?.map((g) => g.id) ?? []),
            };
            addMovie(normalized);
            toast.success('Adicionado à lista', {
                description: `${movie.title} foi adicionado à sua lista`,
            });
        }
    };

    return (
        <Button
            variant={inWatchlist ? 'default' : 'secondary'}
            size={showLabel ? 'default' : 'icon'}
            className={
                showLabel ? 'gap-2 cursor-pointer' : 'h-8 w-8 cursor-pointer'
            }
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
