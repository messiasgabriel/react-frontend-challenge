import { env } from '@/shared/config/env';

const { TMDB_API_KEY, TMDB_BASE_URL } = env;

export async function tmdbFetch<T>(endpoint: string): Promise<T> {
    const url = `${TMDB_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TMDB_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.statusText}`);
    }

    return response.json();
}
