import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from '@/features/movie-search/model/search-store';

describe('useSearchStore', () => {
    beforeEach(() => {
        useSearchStore.setState({ query: '' });
    });

    it('deve iniciar com query vazia', () => {
        const { query } = useSearchStore.getState();
        expect(query).toBe('');
    });

    it('setQuery deve atualizar a query', () => {
        useSearchStore.getState().setQuery('inception');
        expect(useSearchStore.getState().query).toBe('inception');
    });

    it('clearQuery deve resetar a query para vazio', () => {
        useSearchStore.getState().setQuery('matrix');
        useSearchStore.getState().clearQuery();
        expect(useSearchStore.getState().query).toBe('');
    });
});
