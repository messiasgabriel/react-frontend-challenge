import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/shared/hooks/use-debounce';

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearch.length >= 3 || debouncedSearch === '') {
            onSearch(debouncedSearch);
        }
    }, [debouncedSearch, onSearch]);

    return (
        <div className="w-full max-w-2xl">
            <Input
                type="search"
                placeholder="Buscar filmes... (ex: Inception, Matrix)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
            />
            {debouncedSearch && (
                <p className="text-sm text-muted-foreground mt-2">
                    Buscando por: "{debouncedSearch}"
                </p>
            )}
        </div>
    );
}
