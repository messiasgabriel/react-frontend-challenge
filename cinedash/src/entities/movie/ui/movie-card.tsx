import { type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Film, Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { getImageUrl } from '../lib/get-image-url';
import type { Movie } from '../model/types';

type MovieCardProps = {
    movie: Movie;
    action?: ReactNode;
    priority?: boolean;
};

export function MovieCard({ movie, action, priority = false }: MovieCardProps) {
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    return (
        <Link
            to="/movie/$movieId"
            params={{ movieId: String(movie.id) }}
            aria-label={`Ver detalhes de ${movie.title}`}
        >
            <Card className="group relative overflow-hidden bg-card border-border transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-md hover:shadow-primary/10">
                {action && (
                    <div className="absolute top-2 right-2 z-10">{action}</div>
                )}

                {movie.poster_path ? (
                    <img
                        src={getImageUrl(movie.poster_path, 'w342')}
                        alt={movie.title}
                        loading={priority ? 'eager' : 'lazy'}
                        fetchPriority={priority ? 'high' : 'auto'}
                        decoding={priority ? 'sync' : 'async'}
                        width={342}
                        height={513}
                        className="w-full aspect-2/3 object-cover"
                    />
                ) : (
                    <div className="w-full aspect-2/3 bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground" aria-label="Poster não disponível">
                        <Film className="size-10 opacity-40" aria-hidden="true" />
                        <span className="text-xs opacity-40">Sem poster</span>
                    </div>
                )}
                <CardContent className="p-3 space-y-2">
                    <h3 className="text-foreground text-sm font-medium line-clamp-2 h-10 group-hover:text-primary transition-colors">
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                            <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                            {movie.vote_average.toFixed(1)}
                        </div>
                        <p className="text-muted-foreground text-xs">{year}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
