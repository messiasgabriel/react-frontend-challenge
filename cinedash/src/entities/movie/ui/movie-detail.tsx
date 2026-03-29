import { ReactNode } from 'react';
import { Badge } from '@/shared/ui/badge';
import { getImageUrl } from '../lib/get-image-url';
import type { MovieDetails } from '../model/types';

type MovieDetailViewProps = {
    movie: MovieDetails;
    action?: ReactNode;
};

export function MovieDetailView({ movie, action }: MovieDetailViewProps) {
    const year = new Date(movie.release_date).getFullYear();

    return (
        <div className="grid gap-8 md:grid-cols-[auto_1fr]">
            {/* Poster */}
            <div className="w-full md:w-80">
                <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full rounded-xl shadow-2xl"
                />
            </div>

            {/* Info */}
            <div className="space-y-6">
                <div>
                    <h1 className="font-heading text-4xl font-bold md:text-5xl">
                        {movie.title}
                    </h1>
                    {movie.tagline && (
                        <p className="mt-2 text-lg italic text-muted-foreground">
                            {movie.tagline}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">⭐</span>
                        <span className="text-xl font-semibold">
                            {movie.vote_average.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-muted-foreground">{year}</span>
                    <span className="text-muted-foreground">
                        {movie.runtime} min
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                        <Badge key={genre.id} variant="secondary">
                            {genre.name}
                        </Badge>
                    ))}
                </div>

                {action && <div className="pt-2">{action}</div>}

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Sinopse</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        {movie.overview}
                    </p>
                </div>
            </div>
        </div>
    );
}
