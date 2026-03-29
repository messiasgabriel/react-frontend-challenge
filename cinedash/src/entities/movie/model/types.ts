export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    popularity: number;
    adult: boolean;
    original_language: string;
    original_title: string;
}

export interface PaginatedResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export type MovieListResponse = PaginatedResponse<Movie>;

export interface Genre {
    id: number;
    name: string;
}

export interface GenreListResponse {
    genres: Genre[];
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

export interface MovieDetails extends Movie {
    budget: number;
    revenue: number;
    runtime: number | null;
    status: string;
    tagline: string | null;
    homepage: string | null;
    imdb_id: string | null;
    genres: Genre[];
    production_companies: ProductionCompany[];
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface CrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface CreditsResponse {
    id: number;
    cast: CastMember[];
    crew: CrewMember[];
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
    published_at: string;
}

export interface VideosResponse {
    id: number;
    results: Video[];
}

export interface DiscoverParams {
    with_genres?: string;
    primary_release_year?: number;
    'vote_average.gte'?: number;
    'vote_average.lte'?: number;
    'vote_count.gte'?: number;
    sort_by?: string;
    page?: number;
}

export interface WatchlistMovie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}
