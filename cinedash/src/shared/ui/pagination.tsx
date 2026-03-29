import { Button } from './button';

type AdvancedPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: AdvancedPaginationProps) {
    const maxPages = Math.min(totalPages, 500); // TMDB limit

    const getPageNumbers = () => {
        const delta = 2;
        const pages: (number | string)[] = [];

        pages.push(1);

        const rangeStart = Math.max(2, currentPage - delta);
        const rangeEnd = Math.min(maxPages - 1, currentPage + delta);

        if (rangeStart > 2) {
            pages.push('...');
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        if (rangeEnd < maxPages - 1) {
            pages.push('...');
        }

        if (maxPages > 1) {
            pages.push(maxPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-1 pt-4 flex-wrap">
            {/* Primeira */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="cursor-pointer"
            >
                ← Primeira
            </Button>

            {/* Números de página */}
            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-muted-foreground"
                        >
                            ...
                        </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <Button
                        key={pageNum}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        disabled={isActive}
                        className="cursor-pointer min-w-2.5rem"
                    >
                        {pageNum}
                    </Button>
                );
            })}

            {/* Última */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(maxPages)}
                disabled={currentPage === maxPages}
                className="cursor-pointer"
            >
                Última →
            </Button>
        </div>
    );
}
