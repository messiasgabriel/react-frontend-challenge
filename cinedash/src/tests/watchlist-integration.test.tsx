import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WatchlistToggle } from '@/features/watchlist/ui/watchlist-toggle';
import { WatchlistTable } from '@/features/watchlist/ui/watchlist-table';
import { useWatchlistStore } from '@/features/watchlist/model/watchlist-store';
import type { WatchlistMovie } from '@/entities/movie';

vi.mock('@tanstack/react-router', () => ({
    Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
        <a {...props}>{children}</a>
    ),
}));

vi.mock('sonner', () => ({
    toast: Object.assign(vi.fn(), { success: vi.fn() }),
}));

vi.mock('@/entities/movie', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/entities/movie')>();
    return {
        ...actual,
        genresQueryOptions: () => ({
            queryKey: ['genres'],
            queryFn: async () => ({ genres: [{ id: 28, name: 'Action' }] }),
        }),
    };
});

const movie: WatchlistMovie = {
    id: 42,
    title: 'Interstellar',
    poster_path: null,
    release_date: '2014-11-07',
    vote_average: 8.6,
    genre_ids: [28],
};

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('Fluxo: Adicionar e remover da watchlist', () => {
    beforeEach(() => {
        useWatchlistStore.setState({ movies: [] });
    });

    it('WatchlistToggle começa com estado "Adicionar à lista"', () => {
        render(<WatchlistToggle movie={movie} />, { wrapper: createWrapper() });
        const btn = screen.getByRole('button', { name: /adicionar interstellar à lista/i });
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveAttribute('aria-pressed', 'false');
    });

    it('clicar no toggle adiciona o filme ao store', async () => {
        render(<WatchlistToggle movie={movie} />, { wrapper: createWrapper() });
        await userEvent.click(screen.getByRole('button', { name: /adicionar interstellar à lista/i }));
        expect(useWatchlistStore.getState().isInWatchlist(42)).toBe(true);
    });

    it('após adicionar, botão muda para estado "remover"', async () => {
        render(<WatchlistToggle movie={movie} />, { wrapper: createWrapper() });
        await userEvent.click(screen.getByRole('button', { name: /adicionar interstellar à lista/i }));
        expect(screen.getByRole('button', { name: /remover interstellar da lista/i })).toBeInTheDocument();
    });

    it('clicar novamente remove o filme do store (toggle)', async () => {
        render(<WatchlistToggle movie={movie} />, { wrapper: createWrapper() });
        await userEvent.click(screen.getByRole('button', { name: /adicionar interstellar à lista/i }));
        await userEvent.click(screen.getByRole('button', { name: /remover interstellar da lista/i }));
        expect(useWatchlistStore.getState().isInWatchlist(42)).toBe(false);
    });

    it('WatchlistTable exibe filmes que estão no store', () => {
        useWatchlistStore.getState().addMovie(movie);
        render(<WatchlistTable />, { wrapper: createWrapper() });
        expect(screen.getByText('Interstellar')).toBeInTheDocument();
    });

    it('WatchlistTable exibe nota do filme', () => {
        useWatchlistStore.getState().addMovie(movie);
        render(<WatchlistTable />, { wrapper: createWrapper() });
        expect(screen.getByText('8.6')).toBeInTheDocument();
    });

    it('botão Remover na tabela remove o filme do store', () => {
        useWatchlistStore.getState().addMovie(movie);
        render(<WatchlistTable />, { wrapper: createWrapper() });
        fireEvent.click(screen.getByRole('button', { name: /remover/i }));
        expect(useWatchlistStore.getState().movies).toHaveLength(0);
    });

    it('fluxo completo: toggle adiciona → tabela exibe → remover da tabela limpa a lista', async () => {
        const Wrapper = createWrapper();

        const { rerender } = render(
            <Wrapper>
                <WatchlistToggle movie={movie} />
            </Wrapper>,
        );

        useWatchlistStore.getState().addMovie(movie);
        expect(useWatchlistStore.getState().isInWatchlist(42)).toBe(true);

        rerender(
            <Wrapper>
                <WatchlistTable />
            </Wrapper>,
        );

        expect(screen.getByText('Interstellar')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /remover/i }));

        expect(useWatchlistStore.getState().movies).toHaveLength(0);
    });
});
