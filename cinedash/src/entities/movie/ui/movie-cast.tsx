import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/shared/ui/card';
import { getImageUrl } from '../lib/get-image-url';
import { movieCreditsQueryOptions } from '../api/movie.queries';
import type { CastMember } from '../model/types';

function useMovieCast(movieId: number) {
    const { data: credits, isLoading } = useQuery(
        movieCreditsQueryOptions(movieId),
    );

    return {
        cast: credits?.cast.slice(0, 6) ?? [],
        isLoading,
    };
}

function CastMemberCard({ actor }: { actor: CastMember }) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-2 text-center">
                {actor.profile_path ? (
                    <img
                        src={getImageUrl(actor.profile_path, 'w185')}
                        alt={actor.name}
                        className="w-full aspect-2/3 object-cover rounded-lg mb-2"
                    />
                ) : (
                    <div className="w-full aspect-2/3 bg-muted rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                    </div>
                )}
                <p className="font-medium text-xs line-clamp-1">{actor.name}</p>
                <p className="text-muted-foreground text-xs line-clamp-1">
                    {actor.character}
                </p>
            </CardContent>
        </Card>
    );
}

function CastSkeleton() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Elenco Principal</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-2/3 bg-muted rounded-lg mb-2" />
                        <div className="h-4 bg-muted rounded mb-1" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

interface MovieCastProps {
    movieId: number;
}

export function MovieCast({ movieId }: MovieCastProps) {
    const { cast, isLoading } = useMovieCast(movieId);

    if (isLoading) return <CastSkeleton />;
    if (!cast.length) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Elenco Principal</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {cast.map((actor) => (
                    <CastMemberCard key={actor.id} actor={actor} />
                ))}
            </div>
        </div>
    );
}
