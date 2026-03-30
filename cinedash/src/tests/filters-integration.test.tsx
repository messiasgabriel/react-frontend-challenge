import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MovieFilters } from '@/features/movie-filters/ui/movie-filters';
import { useFiltersStore } from '@/features/movie-filters/model/filters-store';

vi.mock('@/entities/movie', () => ({
    genresQueryOptions: () => ({
        queryKey: ['genres'],
        queryFn: async () => ({
            genres: [
                { id: 28, name: 'Action' },
                { id: 35, name: 'Comedy' },
                { id: 18, name: 'Drama' },
            ],
        }),
    }),
}));

// Slider uses pointer events not supported in jsdom — mock to simple range input
vi.mock('@/shared/ui/slider', () => ({
    Slider: ({ value, onValueChange, min, max, step, ...props }: {
        value: number[];
        onValueChange: (v: number[]) => void;
        min: number;
        max: number;
        step: number;
        [key: string]: unknown;
    }) => (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => onValueChange([Number(e.target.value), value[1]])}
            {...props}
        />
    ),
}));

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('Fluxo: Filtros do dashboard', () => {
    beforeEach(() => {
        useFiltersStore.setState({ genreId: null, year: null, minRating: 0, maxRating: 10 });
    });

    it('renderiza o campo de ano e o select de gênero', () => {
        render(<MovieFilters />, { wrapper: createWrapper() });
        expect(screen.getByLabelText(/ano/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('digitar ano válido atualiza o store', async () => {
        render(<MovieFilters />, { wrapper: createWrapper() });
        await userEvent.type(screen.getByLabelText(/ano/i), '2010');
        expect(useFiltersStore.getState().year).toBe(2010);
    });

    it('digitar ano anterior a 1874 exibe erro e não atualiza o store', async () => {
        render(<MovieFilters />, { wrapper: createWrapper() });
        await userEvent.type(screen.getByLabelText(/ano/i), '1800');
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(useFiltersStore.getState().year).toBeNull();
    });

    it('digitar ano futuro exibe erro e não atualiza o store', async () => {
        render(<MovieFilters />, { wrapper: createWrapper() });
        const futureYear = (new Date().getFullYear() + 1).toString();
        await userEvent.type(screen.getByLabelText(/ano/i), futureYear);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(useFiltersStore.getState().year).toBeNull();
    });

    it('limpar o campo de ano reseta o store para null', async () => {
        useFiltersStore.setState({ year: 2020 });
        render(<MovieFilters />, { wrapper: createWrapper() });
        const input = screen.getByLabelText(/ano/i);
        await userEvent.clear(input);
        expect(useFiltersStore.getState().year).toBeNull();
    });

    it('botão "Limpar filtros" aparece quando há filtros ativos', async () => {
        useFiltersStore.setState({ year: 2020 });
        render(<MovieFilters />, { wrapper: createWrapper() });
        expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument();
    });

    it('botão "Limpar filtros" não aparece sem filtros ativos', () => {
        render(<MovieFilters />, { wrapper: createWrapper() });
        expect(screen.queryByRole('button', { name: /limpar filtros/i })).not.toBeInTheDocument();
    });

    it('clicar em "Limpar filtros" reseta o store', async () => {
        useFiltersStore.setState({ genreId: 28, year: 2019, minRating: 5, maxRating: 9 });
        render(<MovieFilters />, { wrapper: createWrapper() });
        await userEvent.click(screen.getByRole('button', { name: /limpar filtros/i }));
        const state = useFiltersStore.getState();
        expect(state.genreId).toBeNull();
        expect(state.year).toBeNull();
        expect(state.minRating).toBe(0);
        expect(state.maxRating).toBe(10);
    });

    it('fluxo completo: digitar ano → validar store → limpar → store resetado', async () => {
        render(<MovieFilters />, { wrapper: createWrapper() });

        await userEvent.type(screen.getByLabelText(/ano/i), '2023');
        expect(useFiltersStore.getState().year).toBe(2023);

        await waitFor(() =>
            expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument(),
        );

        await userEvent.click(screen.getByRole('button', { name: /limpar filtros/i }));
        expect(useFiltersStore.getState().year).toBeNull();
    });
});
