import { env } from '@/shared/config/env';

type ImageSize =
    | 'w92'
    | 'w154'
    | 'w185'
    | 'w342'
    | 'w500'
    | 'w780'
    | 'w1280'
    | 'original';

export function getImageUrl(
    path: string | null,
    size: ImageSize = 'w500',
): string {
    if (!path) {
        return '/placeholder-movie.png';
    }
    return `${env.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
