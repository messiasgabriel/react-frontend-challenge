import { Input } from '@/shared/ui/input';
import { useSearchStore } from '../model/search-store';

export function SearchBar() {
    const query = useSearchStore((s) => s.query);
    const setQuery = useSearchStore((s) => s.setQuery);

    return (
        <div className="w-full max-w-2xl">
            <Input
                type="search"
                placeholder="Buscar filmes... (ex: Inception, Matrix)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
            />
        </div>
    );
}
