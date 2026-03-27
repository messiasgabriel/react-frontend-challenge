import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnDef,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { toast } from 'sonner';
import { getImageUrl } from '@/entities/movie/lib/get-image-url';
import { useWatchlistStore, WatchlistMovie } from '../model/watchlist-store';

export function WatchlistTable() {
    const { movies, removeMovie } = useWatchlistStore();
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleRemove = (movie: WatchlistMovie) => {
        removeMovie(movie.id);
        toast.success('Removido da lista', {
            description: `${movie.title} foi removido da sua watchlist`,
        });
    };

    const columns: ColumnDef<WatchlistMovie>[] = [
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
                    className="hover:bg-slate-800"
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
                    className="text-white hover:text-blue-400 font-medium transition-colors"
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
                    className="hover:bg-slate-800"
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
                return <span className="text-slate-300">{year}</span>;
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
                    className="hover:bg-slate-800"
                >
                    Nota
                    {column.getIsSorted() === 'asc' && ' ↑'}
                    {column.getIsSorted() === 'desc' && ' ↓'}
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-white font-semibold">
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
                    onClick={() => handleRemove(row.original)}
                >
                    Remover
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: movies,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <Card className="bg-slate-900 border-slate-800">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800">
                            {table.getHeaderGroups().map((headerGroup) =>
                                headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-sm font-semibold text-slate-300"
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
                                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
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
