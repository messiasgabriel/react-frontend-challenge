import { tmdbFetch } from '@/shared/api/tmdb-client';
import type { GenresResponse } from '../model/types';

export async function fetchGenres(): Promise<GenresResponse> {
    return tmdbFetch<GenresResponse>('/genre/movie/list');
}
