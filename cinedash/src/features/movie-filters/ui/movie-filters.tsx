import { useQuery } from '@tanstack/react-query';
import { genresQueryOptions } from '@/entities/movie';
import { useFiltersStore } from '../model/filters-store';
import { RatingFilter } from './rating-filter';
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
        maxRating,
        setGenre,
        setYear,
        clearFilters,
    } = useFiltersStore();

    const { data: genresData } = useQuery(genresQueryOptions());

    const hasFilters = genreId || year || minRating > 0 || maxRating < 10;

    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Genre Filter */}
                <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium">Gênero</Label>
                    <Select
                        value={genreId?.toString() || 'all'}
                        onValueChange={(value) =>
                            setGenre(value === 'all' ? null : Number(value))
                        }
                    >
                        <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Todos os gêneros" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Todos os gêneros
                            </SelectItem>
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
                <div className="flex-1 space-y-2">
                    <Label className="text-sm font-medium">Ano</Label>
                    <Select
                        value={year?.toString() || 'all'}
                        onValueChange={(value) =>
                            setYear(value === 'all' ? null : Number(value))
                        }
                    >
                        <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Todos os anos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os anos</SelectItem>
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
                <div className="flex items-end">
                    <RatingFilter />
                </div>

                {/* Clear Button */}
                {hasFilters && (
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="cursor-pointer"
                    >
                        Limpar filtros
                    </Button>
                )}
            </div>
        </div>
    );
}
