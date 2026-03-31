import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
    type ColumnDef,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { XCircle, Film, Star } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { toast } from 'sonner';
import { getImageUrl, genresQueryOptions } from '@/entities/movie';
import type { WatchlistMovie, Genre } from '@/entities/movie';
import { useWatchlistStore } from '../model/watchlist-store';

function createWatchlistColumns(
    onRemove: (movie: WatchlistMovie) => void,
    genres: Genre[],
): ColumnDef<WatchlistMovie>[] {
    return [
        {
            accessorKey: 'poster_path',
            header: 'Poster',
            enableSorting: false,
            cell: ({ row }) => (
                <Link
                    to="/movie/$movieId"
                    params={{ movieId: row.original.id.toString() }}
                >
                    {row.original.poster_path ? (
                        <img
                            src={getImageUrl(row.original.poster_path, 'w92')}
                            alt={row.original.title}
                            className="w-16 rounded shadow-md hover:scale-105 transition-transform cursor-pointer"
                        />
                    ) : (
                        <div className="w-16 aspect-2/3 rounded bg-muted flex items-center justify-center">
                            <Film className="size-5 opacity-40 text-muted-foreground" />
                        </div>
                    )}
                </Link>
            ),
        },
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    aria-label={
                        column.getIsSorted() === 'asc'
                            ? 'Título — ordenado crescente, clique para ordenar decrescente'
                            : column.getIsSorted() === 'desc'
                              ? 'Título — ordenado decrescente, clique para remover ordenação'
                              : 'Título — clique para ordenar'
                    }
                    className="hover:bg-muted"
                >
                    Título
                    {column.getIsSorted() === 'asc' && ' ↑'}
                    {column.getIsSorted() === 'desc' && ' ↓'}
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    to="/movie/$movieId"
                    params={{ movieId: row.original.id.toString() }}
                    className="cursor-pointer text-foreground hover:text-primary font-medium transition-colors underline underline-offset-2 decoration-muted-foreground/40"
                >
                    {row.original.title}
                </Link>
            ),
        },
        {
            accessorKey: 'genre_ids',
            header: 'Gênero',
            enableSorting: false,
            cell: ({ row }) => {
                const names = (row.original.genre_ids ?? [])
                    .slice(0, 2)
                    .map((id) => genres.find((g) => g.id === id)?.name)
                    .filter(Boolean)
                    .join(', ');
                return (
                    <span className="text-muted-foreground text-sm">
                        {names || '—'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'release_date',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    aria-label={
                        column.getIsSorted() === 'asc'
                            ? 'Ano — ordenado crescente, clique para ordenar decrescente'
                            : column.getIsSorted() === 'desc'
                              ? 'Ano — ordenado decrescente, clique para remover ordenação'
                              : 'Ano — clique para ordenar'
                    }
                    className="hover:bg-muted"
                >
                    Ano
                    {column.getIsSorted() === 'asc' && ' ↑'}
                    {column.getIsSorted() === 'desc' && ' ↓'}
                </Button>
            ),
            cell: ({ row }) => {
                const year = row.original.release_date
                    ? new Date(row.original.release_date).getFullYear()
                    : 'N/A';
                return <span className="text-muted-foreground">{year}</span>;
            },
        },
        {
            accessorKey: 'vote_average',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    aria-label={
                        column.getIsSorted() === 'asc'
                            ? 'Nota — ordenado crescente, clique para ordenar decrescente'
                            : column.getIsSorted() === 'desc'
                              ? 'Nota — ordenado decrescente, clique para remover ordenação'
                              : 'Nota — clique para ordenar'
                    }
                    className="hover:bg-muted"
                >
                    Nota
                    {column.getIsSorted() === 'asc' && ' ↑'}
                    {column.getIsSorted() === 'desc' && ' ↓'}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Star className="size-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-foreground font-semibold">
                        {row.original.vote_average.toFixed(1)}
                    </span>
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Ações',
            enableSorting: false,
            cell: ({ row }) => (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(row.original)}
                >
                    Remover
                </Button>
            ),
        },
    ];
}

export function WatchlistTable() {
    const { movies, removeMovie } = useWatchlistStore();
    const [sorting, setSorting] = useState<SortingState>([]);
    const { data: genresData } = useQuery(genresQueryOptions());
    const genres = genresData?.genres ?? [];

    const handleRemove = (movie: WatchlistMovie) => {
        removeMovie(movie.id);
        toast('Removido da lista', {
            description: `${movie.title} foi removido da sua watchlist`,
            icon: <XCircle className="size-4 text-destructive" />,
        });
    };

    const columns = createWatchlistColumns(handleRemove, genres);

    const table = useReactTable({
        data: movies,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <Card className="bg-card border-border">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </th>
                                )),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-border hover:bg-muted/50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-4">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
