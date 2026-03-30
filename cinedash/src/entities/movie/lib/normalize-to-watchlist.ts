import type { WatchlistMovie } from '../model/types';

type MovieLike = WatchlistMovie & {
    genres?: { id: number; name: string }[];
};

export function toWatchlistMovie(movie: MovieLike): WatchlistMovie {
    return {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids?.length
            ? movie.genre_ids
            : (movie.genres?.map((g) => g.id) ?? []),
    };
}
