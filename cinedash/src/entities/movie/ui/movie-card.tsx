import { type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/shared/ui/card';
import { getImageUrl } from '../lib/get-image-url';
import type { Movie } from '../model/types';

type MovieCardProps = {
    movie: Movie;
    action?: ReactNode;
};

export function MovieCard({ movie, action }: MovieCardProps) {
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    return (
        <Link to="/movie/$movieId" params={{ movieId: String(movie.id) }}>
            <Card className="group relative overflow-hidden bg-card border-border transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
                {action && (
                    <div className="absolute top-2 right-2 z-10">
                        {action}
                    </div>
                )}

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
