const { TMDB_API_KEY, TMDB_BASE_URL } = env;
import { env } from '@/shared/config/env';
import { ApiError } from './api-error';

export async function tmdbFetch<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set('language', 'pt-BR');

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                url.searchParams.set(key, String(value));
            }
        }
    }

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
}
