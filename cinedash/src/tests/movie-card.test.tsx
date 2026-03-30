import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MovieCard } from '@/entities/movie/ui/movie-card';
import type { Movie } from '@/entities/movie/model/types';

vi.mock('@tanstack/react-router', () => ({
    Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
        <a {...props}>{children}</a>
    ),
}));

const baseMovie: Movie = {
    id: 1,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets.',
    poster_path: '/inception.jpg',
    backdrop_path: null,
    release_date: '2010-07-16',
    vote_average: 8.8,
    vote_count: 30000,
    genre_ids: [28, 878],
    popularity: 100,
    adult: false,
    original_language: 'en',
    original_title: 'Inception',
    video: false,
};

describe('MovieCard', () => {
    it('renderiza o poster quando poster_path está presente', () => {
        render(<MovieCard movie={baseMovie} />);
        const img = screen.getByRole('img', { name: 'Inception' });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expect.stringContaining('inception.jpg'));
    });

    it('renderiza o fallback quando poster_path é null', () => {
        const movie = { ...baseMovie, poster_path: null };
        render(<MovieCard movie={movie} />);
        expect(screen.queryByRole('img', { name: 'Inception' })).not.toBeInTheDocument();
        expect(screen.getByText('Sem poster')).toBeInTheDocument();
    });

    it('exibe o título do filme', () => {
        render(<MovieCard movie={baseMovie} />);
        expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    it('exibe o rating formatado com uma casa decimal', () => {
        render(<MovieCard movie={baseMovie} />);
        expect(screen.getByText('8.8')).toBeInTheDocument();
    });

    it('exibe o ano de lançamento', () => {
        render(<MovieCard movie={baseMovie} />);
        expect(screen.getByText('2010')).toBeInTheDocument();
    });

    it('exibe "N/A" quando release_date está ausente', () => {
        const movie = { ...baseMovie, release_date: '' };
        render(<MovieCard movie={movie} />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('renderiza o slot de action quando fornecido', () => {
        render(<MovieCard movie={baseMovie} action={<button>+ Watchlist</button>} />);
        expect(screen.getByRole('button', { name: '+ Watchlist' })).toBeInTheDocument();
    });
});
