import { describe, it, expect, beforeEach } from 'vitest';
import { useWatchlistStore } from '@/features/watchlist/model/watchlist-store';
import type { WatchlistMovie } from '@/entities/movie';

const movie1: WatchlistMovie = {
    id: 1,
    title: 'Inception',
    poster_path: '/inception.jpg',
    release_date: '2010-07-16',
    vote_average: 8.8,
    genre_ids: [28, 878],
};

const movie2: WatchlistMovie = {
    id: 2,
    title: 'The Matrix',
    poster_path: '/matrix.jpg',
    release_date: '1999-03-31',
    vote_average: 8.7,
    genre_ids: [28, 878],
};

describe('useWatchlistStore', () => {
    beforeEach(() => {
        useWatchlistStore.setState({ movies: [] });
    });

    it('inicia com lista vazia', () => {
        expect(useWatchlistStore.getState().movies).toHaveLength(0);
    });

    it('addMovie adiciona um filme à lista', () => {
        useWatchlistStore.getState().addMovie(movie1);
        expect(useWatchlistStore.getState().movies).toHaveLength(1);
        expect(useWatchlistStore.getState().movies[0].id).toBe(1);
    });

    it('addMovie não duplica filmes já existentes', () => {
        useWatchlistStore.getState().addMovie(movie1);
        useWatchlistStore.getState().addMovie(movie1);
        expect(useWatchlistStore.getState().movies).toHaveLength(1);
    });

    it('addMovie permite adicionar filmes diferentes', () => {
        useWatchlistStore.getState().addMovie(movie1);
        useWatchlistStore.getState().addMovie(movie2);
        expect(useWatchlistStore.getState().movies).toHaveLength(2);
    });

    it('removeMovie remove o filme correto', () => {
        useWatchlistStore.getState().addMovie(movie1);
        useWatchlistStore.getState().addMovie(movie2);
        useWatchlistStore.getState().removeMovie(1);
        const movies = useWatchlistStore.getState().movies;
        expect(movies).toHaveLength(1);
        expect(movies[0].id).toBe(2);
    });

    it('removeMovie não falha se o filme não estiver na lista', () => {
        useWatchlistStore.getState().removeMovie(999);
        expect(useWatchlistStore.getState().movies).toHaveLength(0);
    });

    it('isInWatchlist retorna true para filme na lista', () => {
        useWatchlistStore.getState().addMovie(movie1);
        expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(true);
    });

    it('isInWatchlist retorna false para filme fora da lista', () => {
        expect(useWatchlistStore.getState().isInWatchlist(999)).toBe(false);
    });

    it('isInWatchlist retorna false após remover o filme', () => {
        useWatchlistStore.getState().addMovie(movie1);
        useWatchlistStore.getState().removeMovie(1);
        expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(false);
    });
});
