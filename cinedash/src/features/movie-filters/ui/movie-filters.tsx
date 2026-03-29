import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { genresQueryOptions } from '@/entities/movie';
import { useFiltersStore } from '../model/filters-store';
import { RatingFilter } from './rating-filter';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
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

    const [yearInput, setYearInput] = useState(year?.toString() ?? '');
    const [yearError, setYearError] = useState('');
    const currentYear = new Date().getFullYear();
    const MIN_YEAR = 1874;

    function handleYearChange(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        setYearInput(digits);
        setYearError('');
        if (digits === '') {
            setYear(null);
        } else if (digits.length === 4) {
            const num = Number(digits);
            if (num < MIN_YEAR) {
                setYearError(`Registros a partir de ${MIN_YEAR}`);
                setYear(null);
            } else if (num > currentYear) {
                setYearError(`Ano não pode ser maior que ${currentYear}`);
                setYear(null);
            } else {
                setYear(num);
            }
        }
    }

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
                    <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Ex: 2023"
                        value={yearInput}
                        onChange={(e) => handleYearChange(e.target.value)}
                        maxLength={4}
                        className="w-fit"
                    />
                    {yearError && (
                        <p className="text-xs text-destructive">{yearError}</p>
                    )}
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
