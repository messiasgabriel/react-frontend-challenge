import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useSearchStore } from '@/features/movie-search';
import { useFiltersStore } from '@/features/movie-filters';
import {
    trendingQueryOptions,
    searchQueryOptions,
    discoverQueryOptions,
} from '@/entities/movie';
import type { DiscoverParams } from '@/entities/movie';

export function useMoviesQuery(page: number) {
    const query = useSearchStore((s) => s.query);
    const debouncedQuery = useDebounce(query, 300);
    const { genreId, year, minRating, maxRating } = useFiltersStore();

    const isSearching = debouncedQuery.length > 0;
    const hasFilters = !!(genreId || year || minRating > 0 || maxRating < 10);

    const discoverParams: DiscoverParams = {
        ...(genreId && { with_genres: String(genreId) }),
        ...(year && { primary_release_year: year }),
        ...(minRating > 0 && { 'vote_average.gte': minRating }),
        ...(maxRating < 10 && { 'vote_average.lte': maxRating }),
        page,
    };

    const trendingResult = useQuery({
        ...trendingQueryOptions(page),
        enabled: !isSearching && !hasFilters,
    });

    const searchResult = useQuery({
        ...searchQueryOptions(debouncedQuery, page),
        enabled: isSearching,
    });

    const discoverResult = useQuery({
        ...discoverQueryOptions(discoverParams, page),
        enabled: !isSearching && hasFilters,
    });

    const activeResult = isSearching
        ? searchResult
        : hasFilters
          ? discoverResult
          : trendingResult;

    const title = isSearching
        ? `Resultados para "${debouncedQuery}"`
        : hasFilters
          ? 'Filmes Filtrados'
          : 'Em Alta';

    return {
        movies: activeResult.data?.results ?? [],
        totalPages: activeResult.data?.total_pages ?? 1,
        isLoading: activeResult.isLoading,
        isError: activeResult.isError,
        refetch: activeResult.refetch,
        title,
        isSearching,
    };
}
