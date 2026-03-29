import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchlistMovie } from '@/entities/movie';

type WatchlistState = {
    movies: WatchlistMovie[];
    addMovie: (movie: WatchlistMovie) => void;
    removeMovie: (movieId: number) => void;
    isInWatchlist: (movieId: number) => boolean;
};

export const useWatchlistStore = create<WatchlistState>()(
    persist(
        (set, get) => ({
            movies: [],

            addMovie: (movie) => {
                const { movies } = get();
                if (!movies.find((m) => m.id === movie.id)) {
                    set({ movies: [...movies, movie] });
                }
            },

            removeMovie: (movieId) => {
                set((state) => ({
                    movies: state.movies.filter((m) => m.id !== movieId),
                }));
            },

            isInWatchlist: (movieId) => {
                return get().movies.some((m) => m.id === movieId);
            },
        }),
        {
            name: 'watchlist-storage',
        },
    ),
);
