import { Button } from './button';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const maxPages = Math.min(totalPages, 500); // TMDB limit

    const getPageNumbers = () => {
        const pages: number[] = [];

        if (currentPage > 1) pages.push(currentPage - 1);
        pages.push(currentPage);
        if (currentPage < maxPages) pages.push(currentPage + 1);

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
                Primeira
            </Button>

            {currentPage > 2 && (
                <span className="px-1 text-muted-foreground">...</span>
            )}

            {/* Números de página */}
            {pages.map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                    <Button
                        key={pageNum}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        disabled={isActive}
                        className="cursor-pointer min-w-9"
                    >
                        {pageNum}
                    </Button>
                );
            })}

            {currentPage < maxPages - 1 && (
                <span className="px-1 text-muted-foreground">...</span>
            )}

            {/* Última */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(maxPages)}
                disabled={currentPage === maxPages}
                className="cursor-pointer"
            >
                Última
            </Button>
        </div>
    );
}
