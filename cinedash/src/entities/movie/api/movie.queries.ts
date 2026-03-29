import { queryOptions, keepPreviousData } from '@tanstack/react-query';
import {
    fetchPopularMovies,
    fetchTrendingMovies,
    searchMovies,
    discoverMovies,
    fetchMovieDetails,
    fetchMovieCredits,
    fetchMovieVideos,
    fetchGenres,
} from './movie.api';
import type { DiscoverParams } from '../model/types';

export const movieKeys = {
    all: ['movies'] as const,
    popular: (page: number) => [...movieKeys.all, 'popular', page] as const,
    trending: (page: number) => [...movieKeys.all, 'trending', page] as const,
    search: (query: string, page: number) =>
        [...movieKeys.all, 'search', query, page] as const,
    discover: (params: DiscoverParams, page: number) =>
        [...movieKeys.all, 'discover', params, page] as const,
    detail: (id: number) => [...movieKeys.all, 'detail', id] as const,
    credits: (id: number) => [...movieKeys.all, 'credits', id] as const,
    videos: (id: number) => [...movieKeys.all, 'videos', id] as const,
    genres: () => [...movieKeys.all, 'genres'] as const,
};

export function popularQueryOptions(page: number) {
    return queryOptions({
        queryKey: movieKeys.popular(page),
        queryFn: () => fetchPopularMovies(page),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
}

export function trendingQueryOptions(page: number) {
    return queryOptions({
        queryKey: movieKeys.trending(page),
        queryFn: () => fetchTrendingMovies(page),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
}

export function searchQueryOptions(query: string, page: number) {
    return queryOptions({
        queryKey: movieKeys.search(query, page),
        queryFn: () => searchMovies(query, page),
        staleTime: 2 * 60 * 1000,
        enabled: query.length > 0,
        placeholderData: keepPreviousData,
    });
}

export function discoverQueryOptions(params: DiscoverParams, page: number) {
    return queryOptions({
        queryKey: movieKeys.discover(params, page),
        queryFn: () => discoverMovies({ ...params, page }),
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
}

export function movieDetailQueryOptions(id: number) {
    return queryOptions({
        queryKey: movieKeys.detail(id),
        queryFn: () => fetchMovieDetails(id),
        staleTime: 30 * 60 * 1000,
    });
}

export function movieCreditsQueryOptions(id: number) {
    return queryOptions({
        queryKey: movieKeys.credits(id),
        queryFn: () => fetchMovieCredits(id),
        staleTime: 60 * 60 * 1000,
    });
}

export function movieVideosQueryOptions(id: number) {
    return queryOptions({
        queryKey: movieKeys.videos(id),
        queryFn: () => fetchMovieVideos(id),
        staleTime: 60 * 60 * 1000,
    });
}

export function genresQueryOptions() {
    return queryOptions({
        queryKey: movieKeys.genres(),
        queryFn: fetchGenres,
        staleTime: Infinity,
    });
}
