import { tmdbFetch } from '@/shared/api/tmdb-client';
import type {
    CreditsResponse,
    DiscoverParams,
    GenreListResponse,
    MovieDetails,
    MovieListResponse,
    VideosResponse,
} from '../model/types';

export function fetchPopularMovies(page = 1) {
    return tmdbFetch<MovieListResponse>('/movie/popular', { page });
}

export function fetchTrendingMovies(page = 1) {
    return tmdbFetch<MovieListResponse>('/trending/movie/week', { page });
}

export function searchMovies(query: string, page = 1) {
    return tmdbFetch<MovieListResponse>('/search/movie', { query, page });
}

export function discoverMovies(params: DiscoverParams) {
    return tmdbFetch<MovieListResponse>(
        '/discover/movie',
        params as Record<string, string | number | undefined>,
    );
}

export function fetchMovieDetails(movieId: number) {
    return tmdbFetch<MovieDetails>(`/movie/${movieId}`);
}

export function fetchMovieCredits(movieId: number) {
    return tmdbFetch<CreditsResponse>(`/movie/${movieId}/credits`);
}

export function fetchMovieVideos(movieId: number) {
    return tmdbFetch<VideosResponse>(`/movie/${movieId}/videos`);
}

export function fetchGenres() {
    return tmdbFetch<GenreListResponse>('/genre/movie/list');
}
