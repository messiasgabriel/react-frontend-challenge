import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useMoviesQuery } from '@/routes/_authenticated/hooks/-use-movies-query';
import { useSearchStore } from '@/features/movie-search/model/search-store';
import { useFiltersStore } from '@/features/movie-filters/model/filters-store';

vi.mock('@/shared/hooks/use-debounce', () => ({
    useDebounce: (value: string) => value,
}));

const mockTrendingData = { results: [{ id: 1, title: 'Trending Movie' }], total_pages: 5 };
const mockSearchData = { results: [{ id: 2, title: 'Search Result' }], total_pages: 3 };
const mockDiscoverData = { results: [{ id: 3, title: 'Discover Movie' }], total_pages: 7 };
const mockGenresData = { genres: [{ id: 28, name: 'Action' }] };

vi.mock('@/entities/movie', () => ({
    trendingQueryOptions: (page: number) => ({
        queryKey: ['trending', page],
        queryFn: async () => mockTrendingData,
    }),
    searchQueryOptions: (query: string, page: number) => ({
        queryKey: ['search', query, page],
        queryFn: async () => mockSearchData,
    }),
    discoverQueryOptions: (params: object, page: number) => ({
        queryKey: ['discover', JSON.stringify(params), page],
        queryFn: async () => mockDiscoverData,
    }),
    genresQueryOptions: () => ({
        queryKey: ['genres'],
        queryFn: async () => mockGenresData,
    }),
}));

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const resetStores = () => {
    useSearchStore.setState({ query: '' });
    useFiltersStore.setState({ genreId: null, year: null, minRating: 0, maxRating: 10 });
};

describe('useMoviesQuery', () => {
    beforeEach(resetStores);

    it('sem query e sem filtros → usa trending, isSearching e hasFilters são false', async () => {
        const { result } = renderHook(() => useMoviesQuery(1), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.isSearching).toBe(false);
        expect(result.current.hasFilters).toBe(false);
        expect(result.current.movies).toEqual(mockTrendingData.results);
        expect(result.current.totalPages).toBe(5);
    });

    it('com query → usa search, isSearching é true, title inclui a query', async () => {
        useSearchStore.setState({ query: 'inception' });
        const { result } = renderHook(() => useMoviesQuery(1), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.isSearching).toBe(true);
        expect(result.current.movies).toEqual(mockSearchData.results);
        expect(result.current.title).toBe('Resultados para "inception"');
        expect(result.current.totalPages).toBe(3);
    });

    it('com filtro de gênero (sem query) → usa discover, hasFilters é true', async () => {
        useFiltersStore.setState({ genreId: 28, year: null, minRating: 0, maxRating: 10 });
        const { result } = renderHook(() => useMoviesQuery(1), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.hasFilters).toBe(true);
        expect(result.current.isSearching).toBe(false);
        expect(result.current.movies).toEqual(mockDiscoverData.results);
        expect(result.current.totalPages).toBe(7);
    });

    it('com filtro de minRating > 0 → hasFilters é true', async () => {
        useFiltersStore.setState({ genreId: null, year: null, minRating: 5, maxRating: 10 });
        const { result } = renderHook(() => useMoviesQuery(1), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.hasFilters).toBe(true);
        expect(result.current.movies).toEqual(mockDiscoverData.results);
    });

    it('query tem prioridade sobre filtros ativos', async () => {
        useSearchStore.setState({ query: 'matrix' });
        useFiltersStore.setState({ genreId: 28, year: null, minRating: 0, maxRating: 10 });
        const { result } = renderHook(() => useMoviesQuery(1), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.isSearching).toBe(true);
        expect(result.current.movies).toEqual(mockSearchData.results);
    });

    it('isLoading é true antes dos dados chegarem', () => {
        const { result } = renderHook(() => useMoviesQuery(1), { wrapper: createWrapper() });
        expect(result.current.isLoading).toBe(true);
    });

    it('title mostra nome do gênero quando genreId tem correspondência nos dados', async () => {
        useFiltersStore.setState({ genreId: 28, year: null, minRating: 0, maxRating: 10 });
        const { result } = renderHook(() => useMoviesQuery(1), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.title).toBe('Action');
    });
});
