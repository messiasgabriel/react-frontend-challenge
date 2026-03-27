export type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
};
export type DiscoverParams = {
    page?: number;
    genreId?: number | null;
    year?: number | null;
    minRating?: number | null;
};
export type Genre = {
    id: number;
    name: string;
};
export type MovieTrailerProps = {
    videoKey: string;
    title: string;
    open: boolean;
    onClose: () => void;
};
export type MoviesResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
};

export type MovieDetails = {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    adult: boolean;
    genres: Genre[]; // ← Array de objetos, não IDs!
    runtime: number;
    budget: number;
    revenue: number;
    tagline: string;
    status: string;
    homepage: string;
    production_companies: Array<{
        id: number;
        name: string;
        logo_path: string | null;
    }>;
};

export type Cast = {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
};

export type CreditsResponse = {
    id: number;
    cast: Cast[];
};

export type Video = {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
};

export type VideosResponse = {
    id: number;
    results: Video[];
};
