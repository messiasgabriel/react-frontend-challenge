import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
    type ColumnDef,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { toast } from 'sonner';
import { getImageUrl } from '@/entities/movie';
import type { WatchlistMovie } from '@/entities/movie';
import { useWatchlistStore } from '../model/watchlist-store';

function createWatchlistColumns(
    onRemove: (movie: WatchlistMovie) => void,
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
                    <img
                        src={getImageUrl(row.original.poster_path, 'w92')}
                        alt={row.original.title}
                        className="w-16 rounded shadow-md hover:scale-105 transition-transform cursor-pointer"
                    />
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
                    className="cursor-pointer text-foreground hover:text-primary font-medium transition-colors"
                >
                    {row.original.title}
                </Link>
            ),
        },
        {
            accessorKey: 'release_date',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
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
                    className="hover:bg-muted"
                >
                    Nota
                    {column.getIsSorted() === 'asc' && ' ↑'}
                    {column.getIsSorted() === 'desc' && ' ↓'}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
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
    'use no memo';
    const { movies, removeMovie } = useWatchlistStore();
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleRemove = (movie: WatchlistMovie) => {
        removeMovie(movie.id);
        toast.success('Removido da lista', {
            description: `${movie.title} foi removido da sua watchlist`,
        });
    };

    const columns = createWatchlistColumns(handleRemove);

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
                                                  header.column.columnDef.header,
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
