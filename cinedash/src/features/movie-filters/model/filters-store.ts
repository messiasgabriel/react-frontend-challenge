import { create } from 'zustand';

type FiltersState = {
    genreId: number | null;
    year: number | null;
    minRating: number;
    maxRating: number;
    setGenre: (id: number | null) => void;
    setYear: (year: number | null) => void;
    setRatingRange: (min: number, max: number) => void;
    clearFilters: () => void;
};

export const useFiltersStore = create<FiltersState>((set) => ({
    genreId: null,
    year: null,
    minRating: 0,
    maxRating: 10,

    setGenre: (id) => set({ genreId: id }),
    setYear: (year) => set({ year }),
    setRatingRange: (min, max) => set({ minRating: min, maxRating: max }),

    clearFilters: () =>
        set({
            genreId: null,
            year: null,
            minRating: 0,
            maxRating: 10,
        }),
}));
