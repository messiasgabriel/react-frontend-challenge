import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { trendingQueryOptions, MovieHero } from '@/entities/movie';
import { AppHeader } from '@/app/layouts/app-header';

export const Route = createFileRoute('/')({
    component: HomePage,
});

export function HomePage() {
    const { data } = useQuery(trendingQueryOptions(1));
    const movies = data?.results ?? [];

    return (
        <div className="flex-1">
            <AppHeader />
            <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <MovieHero movies={movies} showActions={false} />
            </main>
        </div>
    );
}
