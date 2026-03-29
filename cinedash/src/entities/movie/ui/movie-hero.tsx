import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Star } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/shared/ui/carousel';
import { Button } from '@/shared/ui/button';
import { WatchlistToggle } from '@/features/watchlist';
import { getImageUrl } from '../lib/get-image-url';
import type { Movie } from '../model/types';

type MovieHeroProps = {
    movies: Movie[];
    showActions?: boolean;
};

function HeroSkeleton() {
    return (
        <div className="relative w-full aspect-16/7 rounded-xl bg-muted animate-pulse" />
    );
}

export function MovieHero({ movies, showActions = true }: MovieHeroProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const featured = movies.slice(0, 8);

    useEffect(() => {
        if (!api) return;
        api.on('select', () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext();
            } else {
                api.scrollTo(0);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    if (!featured.length) return <HeroSkeleton />;

    return (
        <div className="relative w-full space-y-4">
            <div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Sua curadoria<span className="text-primary"> cinematográfica</span>
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Descubra, salve e acompanhe os melhores filmes em um só lugar.
                </p>
            </div>

            <Carousel setApi={setApi} opts={{ loop: true }}>
                <CarouselContent>
                    {featured.map((movie) => (
                        <CarouselItem key={movie.id}>
                            <div className="relative w-full aspect-16/7 overflow-hidden rounded-xl">
                                {movie.backdrop_path ? (
                                    <img
                                        src={getImageUrl(
                                            movie.backdrop_path,
                                            'w1280',
                                        )}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted" />
                                )}

                                {/* Gradiente overlay */}
                                <div className="absolute inset-0 bg-gradient-to- from-black/80 via-black/30 to-transparent" />

                                {/* Conteúdo */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                                    <h2 className="text-white text-2xl font-bold line-clamp-1 md:text-4xl drop-shadow">
                                        {movie.title}
                                    </h2>

                                    <div className="flex items-center gap-3 text-sm text-white/80">
                                        <span className="flex items-center gap-1">
                                            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                                            {movie.vote_average.toFixed(1)}
                                        </span>
                                        {movie.release_date && (
                                            <span>
                                                {new Date(
                                                    movie.release_date,
                                                ).getFullYear()}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-white/70 text-sm line-clamp-2 max-w-xl hidden md:block">
                                        {movie.overview}
                                    </p>

                                    {showActions && (
                                        <div className="flex items-center gap-2 pt-1">
                                            <Link
                                                to="/movie/$movieId"
                                                params={{
                                                    movieId: String(movie.id),
                                                }}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="cursor-pointer"
                                                >
                                                    Ver detalhes
                                                </Button>
                                            </Link>
                                            <WatchlistToggle movie={movie} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Indicadores */}
            <div className="flex justify-center gap-1.5 mt-3">
                {featured.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            i === current
                                ? 'w-6 bg-primary'
                                : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                        }`}
                        aria-label={`Ir para slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
