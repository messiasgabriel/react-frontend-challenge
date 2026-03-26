import { Card, CardContent } from '@/components/ui/card';
import { getImageUrl } from '../lib/get-image-url';
import type { Movie } from '../model/type';

type MovieCardProps = {
    movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
    return (
        <Card className="group overflow-hidden bg-slate-900 border-slate-800 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
            <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full aspect-2/3 object-cover"
            />
            <CardContent className="p-3 space-y-2">
                <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {movie.title}
                </h3>
                <div className="flex items-center justify-between">
                    <p className="text-yellow-500 text-sm font-medium">
                        ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                    <p className="text-slate-400 text-xs">
                        {new Date(movie.release_date).getFullYear()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
