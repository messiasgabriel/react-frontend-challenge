import { ReactNode } from 'react';
import { Film, ExternalLink, Star } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { getImageUrl } from '../lib/get-image-url';
import type { MovieDetails } from '../model/types';

type MovieDetailViewProps = {
    movie: MovieDetails;
    action?: ReactNode;
};

const languageNames = new Intl.DisplayNames(['pt-BR'], { type: 'language' });
const regionNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' });

function formatLanguage(code: string) {
    try {
        return languageNames.of(code) ?? code;
    } catch {
        return code;
    }
}

function formatCountry(code: string) {
    try {
        return regionNames.of(code) ?? code;
    } catch {
        return code;
    }
}

function formatCurrency(value: number) {
    if (!value) return null;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

const STATUS_LABELS: Record<string, string> = {
    Released: 'Lançado',
    'In Production': 'Em produção',
    'Post Production': 'Pós-produção',
    Planned: 'Planejado',
    Canceled: 'Cancelado',
    Rumored: 'Rumor',
};

export function MovieDetailView({ movie, action }: MovieDetailViewProps) {
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 'N/A';

    const budget = formatCurrency(movie.budget);
    const revenue = formatCurrency(movie.revenue);
    const statusLabel = STATUS_LABELS[movie.status] ?? movie.status;
    const showOriginalTitle =
        movie.original_title && movie.original_title !== movie.title;

    return (
        <div className="grid gap-8 md:grid-cols-[auto_1fr]">
            {/* Poster */}
            <div className="w-full md:w-80">
                {movie.poster_path ? (
                    <img
                        src={getImageUrl(movie.poster_path, 'w500')}
                        alt={movie.title}
                        className="w-full rounded-xl shadow-2xl"
                    />
                ) : (
                    <div className="w-full aspect-2/3 rounded-xl bg-muted flex flex-col items-center justify-center gap-3 text-muted-foreground shadow-2xl">
                        <Film className="size-16 opacity-40" />
                        <span className="text-sm opacity-40">Sem poster</span>
                    </div>
                )}
                {movie.tagline && (
                    <p className="mt-3 text-sm italic text-muted-foreground text-center">
                        "{movie.tagline}"
                    </p>
                )}
            </div>

            {/* Info */}
            <div className="space-y-6">
                {/* Título */}
                <div>
                    <h1 className="font-heading text-4xl font-bold md:text-5xl">
                        {movie.title}
                    </h1>
                    {showOriginalTitle && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            Título original: {movie.original_title}
                        </p>
                    )}
                </div>

                {/* Métricas */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <Star className="size-5 fill-yellow-500 text-yellow-500" />
                        <span className="text-xl font-semibold">
                            {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            ({movie.vote_count.toLocaleString('pt-BR')} votos)
                        </span>
                    </div>
                    <span className="text-muted-foreground">{year}</span>
                    {movie.runtime != null && movie.runtime > 0 && (
                        <span className="text-muted-foreground">
                            {movie.runtime} min
                        </span>
                    )}
                    <Badge variant="outline">{statusLabel}</Badge>
                </div>

                {/* Gêneros */}
                <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                        <Badge key={genre.id} variant="secondary">
                            {genre.name}
                        </Badge>
                    ))}
                </div>

                {action && <div className="pt-2">{action}</div>}

                {/* Sinopse */}
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Sinopse</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        {movie.overview || 'Sinopse não disponível.'}
                    </p>
                </div>

                {/* Detalhes extras */}
                <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                    {budget && (
                        <div>
                            <p className="text-muted-foreground">Orçamento</p>
                            <p className="font-medium">{budget}</p>
                        </div>
                    )}
                    {revenue && (
                        <div>
                            <p className="text-muted-foreground">Bilheteria</p>
                            <p className="font-medium">{revenue}</p>
                        </div>
                    )}
                    {movie.original_language && (
                        <div>
                            <p className="text-muted-foreground">
                                Idioma original
                            </p>
                            <p className="font-medium">
                                {formatLanguage(movie.original_language)}
                            </p>
                        </div>
                    )}
                    {movie.spoken_languages?.length > 0 && (
                        <div>
                            <p className="text-muted-foreground">Idiomas</p>
                            <p className="font-medium">
                                {movie.spoken_languages
                                    .map((l) => l.english_name)
                                    .join(', ')}
                            </p>
                        </div>
                    )}
                    {movie.origin_country?.length > 0 && (
                        <div>
                            <p className="text-muted-foreground">
                                País de origem
                            </p>
                            <p className="font-medium">
                                {movie.origin_country.map(formatCountry).join(', ')}
                            </p>
                        </div>
                    )}
                    {movie.production_companies?.length > 0 && (
                        <div>
                            <p className="text-muted-foreground">Produtoras</p>
                            <p className="font-medium">
                                {movie.production_companies
                                    .slice(0, 2)
                                    .map((c) => c.name)
                                    .join(', ')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Links externos */}
                <div className="flex flex-wrap gap-3">
                    {movie.imdb_id && (
                        <a
                            href={`https://www.imdb.com/title/${movie.imdb_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ExternalLink className="size-3.5" />
                            IMDb
                        </a>
                    )}
                    {movie.homepage && (
                        <a
                            href={movie.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ExternalLink className="size-3.5" />
                            Site oficial
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
