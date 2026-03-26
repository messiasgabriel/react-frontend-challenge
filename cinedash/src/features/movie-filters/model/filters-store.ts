import { create } from 'zustand';

type FiltersState = {
    genreId: number | null;
    year: number | null;
    minRating: number | null;
    setGenre: (id: number | null) => void;
    setYear: (year: number | null) => void;
    setMinRating: (rating: number | null) => void;
    clearFilters: () => void;
};

export const useFiltersStore = create<FiltersState>((set) => ({
    genreId: null,
    year: null,
    minRating: null,

    setGenre: (id) => set({ genreId: id }),
    setYear: (year) => set({ year }),
    setMinRating: (rating) => set({ minRating: rating }),

    clearFilters: () =>
        set({
            genreId: null,
            year: null,
            minRating: null,
        }),
}));
