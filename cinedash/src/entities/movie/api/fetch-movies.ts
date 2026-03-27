import { tmdbFetch } from './tmdb-client';
import type { MoviesResponse } from '../model/types';

export async function fetchPopularMovies(page = 1): Promise<MoviesResponse> {
    return tmdbFetch<MoviesResponse>(`/movie/popular?page=${page}`);
}

export async function fetchTrendingMovies(): Promise<MoviesResponse> {
    return tmdbFetch<MoviesResponse>('/trending/movie/week');
}

export async function searchMovies(
    query: string,
    page = 1,
): Promise<MoviesResponse> {
    return tmdbFetch<MoviesResponse>(
        `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    );
}

type DiscoverParams = {
    page?: number;
    genreId?: number | null;
    year?: number | null;
    minRating?: number | null;
};

export async function discoverMovies(
    params: DiscoverParams = {},
): Promise<MoviesResponse> {
    const { page = 1, genreId, year, minRating } = params;

    const queryParams = new URLSearchParams({
        page: page.toString(),
        sort_by: 'popularity.desc',
    });

    if (genreId) {
        queryParams.append('with_genres', genreId.toString());
    }

    if (year) {
        queryParams.append('primary_release_year', year.toString());
    }

    if (minRating) {
        queryParams.append('vote_average.gte', minRating.toString());
    }

    return tmdbFetch<MoviesResponse>(
        `/discover/movie?${queryParams.toString()}`,
    );
}
