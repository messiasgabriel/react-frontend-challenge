import { tmdbFetch } from './tmdb-client';
import type { MoviesResponse } from '../model/type';

export async function fetchPopularMovies(page = 1): Promise<MoviesResponse> {
    return tmdbFetch<MoviesResponse>(`/movie/popular?page=${page}`);
}
export async function fetchTrendingMovies(): Promise<MoviesResponse> {
    return tmdbFetch<MoviesResponse>('/trending/movie/week');
}
