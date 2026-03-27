export type {
    Movie,
    MovieDetails,
    Genre,
    Cast,
    Video,
    DiscoverParams,
    MoviesResponse,
    CreditsResponse,
    VideosResponse,
    MovieTrailerProps,
} from './model/types';

export {
    fetchPopularMovies,
    fetchTrendingMovies,
    searchMovies,
    discoverMovies,
    fetchMovieDetails,
    fetchMovieCredits,
    fetchMovieVideos,
} from './api/fetch-movies';

export { getImageUrl } from './lib/get-image-url';

export { MovieCard } from './ui/movie-card';
export { MovieCardSkeleton } from './ui/movie-card-skeleton';
