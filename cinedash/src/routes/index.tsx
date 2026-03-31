import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { trendingQueryOptions, MovieHero } from '@/entities/movie';
import { AppHeader } from '@/app/layouts/app-header';
import { Search, Bookmark, Clapperboard, Globe, RefreshCw, Film } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const Route = createFileRoute('/')({
    component: HomePage,
});

const stats = [
    { icon: Film, label: '1M+ filmes disponíveis' },
    { icon: Globe, label: '40+ idiomas' },
    { icon: RefreshCw, label: 'Atualizado diariamente' },
];

const features = [
    {
        icon: Search,
        title: 'Descubra',
        description: 'Filtre por gênero, ano de lançamento e nota. Encontre exatamente o que você quer assistir.',
    },
    {
        icon: Bookmark,
        title: 'Salve',
        description: 'Adicione filmes à sua watchlist pessoal e acesse quando quiser, sem perder nenhum título.',
    },
    {
        icon: Clapperboard,
        title: 'Explore',
        description: 'Veja trailer, elenco completo, orçamento, produtoras e links para IMDb e site oficial.',
    },
];

export function HomePage() {
    const { data } = useQuery(trendingQueryOptions(1));
    const movies = data?.results ?? [];

    return (
        <div className="flex-1">
            <AppHeader />
            <main id="main-content" className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-16">

                <MovieHero movies={movies} showActions={false} />

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
                    {stats.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2.5 text-muted-foreground">
                            <Icon className="size-4 text-primary shrink-0" aria-hidden="true" />
                            <span className="text-sm font-medium">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Como funciona */}
                <section aria-labelledby="features-heading" className="space-y-8">
                    <h2 id="features-heading" className="text-2xl font-bold text-center text-foreground">
                        Como funciona
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {features.map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="flex flex-col items-center text-center gap-4 rounded-xl border border-border bg-card p-6"
                            >
                                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                    <Icon className="size-5 text-primary" aria-hidden="true" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="flex justify-center pb-4">
                    <Button asChild size="lg" className="gap-2 cursor-pointer px-8">
                        <Link to="/dashboard" search={{ page: 1 }}>
                            <Search className="size-4" aria-hidden="true" />
                            Explorar catálogo
                        </Link>
                    </Button>
                </div>

            </main>
        </div>
    );
}
