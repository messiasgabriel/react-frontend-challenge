export type {
    Movie,
    MovieDetails,
    MovieListResponse,
    PaginatedResponse,
    Genre,
    GenreListResponse,
    ProductionCompany,
    CastMember,
    CrewMember,
    CreditsResponse,
    Video,
    VideosResponse,
    DiscoverParams,
    WatchlistMovie,
} from './model/types';

export {
    fetchPopularMovies,
    fetchTrendingMovies,
    searchMovies,
    discoverMovies,
    fetchMovieDetails,
    fetchMovieCredits,
    fetchMovieVideos,
    fetchGenres,
} from './api/movie.api';

export {
    movieKeys,
    popularQueryOptions,
    trendingQueryOptions,
    searchQueryOptions,
    discoverQueryOptions,
    movieDetailQueryOptions,
    movieCreditsQueryOptions,
    movieVideosQueryOptions,
    genresQueryOptions,
} from './api/movie.queries';

export { getImageUrl } from './lib/get-image-url';

export { MovieCard } from './ui/movie-card';
export { MovieCardSkeleton } from './ui/movie-card-skeleton';
export { MovieDetailView } from './ui/movie-detail';
export { MovieCast } from './ui/movie-cast';
export { MovieTrailer } from './ui/movie-trailer';
