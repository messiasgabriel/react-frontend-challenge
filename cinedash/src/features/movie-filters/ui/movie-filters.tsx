import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '@/entities/movie/api/fetch-movies';
import { useFiltersStore } from '../model/filters-store';
import { Button } from '@/shared/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { Label } from '@/shared/ui/label';

export function MovieFilters() {
    const {
        genreId,
        year,
        minRating,
        setGenre,
        setYear,
        setMinRating,
        clearFilters,
    } = useFiltersStore();

    const { data: genresData } = useQuery({
        queryKey: ['genres'],
        queryFn: fetchGenres,
        staleTime: Infinity,
    });

    const hasFilters = genreId || year || minRating;

    return (
        <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                    Filtros
                </h3>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Limpar
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Genre Filter */}
                <div className="space-y-2">
                    <Label>Gênero</Label>
                    <Select
                        value={genreId?.toString() || 'all'}
                        onValueChange={(value) =>
                            setGenre(value === 'all' ? null : Number(value))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {genresData?.genres.map((genre) => (
                                <SelectItem
                                    key={genre.id}
                                    value={genre.id.toString()}
                                >
                                    {genre.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                    <Label>Ano</Label>
                    <Select
                        value={year?.toString() || 'all'}
                        onValueChange={(value) =>
                            setYear(value === 'all' ? null : Number(value))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {Array.from(
                                { length: 10 },
                                (_, i) => new Date().getFullYear() - i,
                            ).map((y) => (
                                <SelectItem key={y} value={y.toString()}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                    <Label>Nota Mínima</Label>
                    <Select
                        value={minRating?.toString() || 'all'}
                        onValueChange={(value) =>
                            setMinRating(value === 'all' ? null : Number(value))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="7">7+</SelectItem>
                            <SelectItem value="8">8+</SelectItem>
                            <SelectItem value="9">9+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
