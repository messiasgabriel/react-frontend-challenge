import { useQuery } from '@tanstack/react-query';
import { movieVideosQueryOptions } from '../api/movie.queries';
import type { Video } from '../model/types';

function useMovieTrailer(movieId: number) {
    const { data: videos, isLoading } = useQuery(
        movieVideosQueryOptions(movieId),
    );

    const trailer = videos?.results.find(
        (video) =>
            video.type === 'Trailer' &&
            video.site === 'YouTube' &&
            (video.official || video.name.toLowerCase().includes('official')),
    );

    return { trailer, isLoading };
}

function TrailerSkeleton() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Trailer</h2>
            <div className="aspect-video w-full bg-muted rounded-xl animate-pulse" />
        </div>
    );
}

function TrailerPlayer({ video }: { video: Video }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Trailer</h2>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
                <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}

interface MovieTrailerProps {
    movieId: number;
}

export function MovieTrailer({ movieId }: MovieTrailerProps) {
    const { trailer, isLoading } = useMovieTrailer(movieId);

    if (isLoading) return <TrailerSkeleton />;
    if (!trailer) return null;

    return <TrailerPlayer video={trailer} />;
}
