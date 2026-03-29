import { Star } from 'lucide-react';
import { Slider } from '@/shared/ui/slider';
import { useFiltersStore } from '../model/filters-store';

export function RatingFilter() {
    const minRating = useFiltersStore((s) => s.minRating);
    const maxRating = useFiltersStore((s) => s.maxRating);
    const setRatingRange = useFiltersStore((s) => s.setRatingRange);

    const isActive = minRating > 0 || maxRating < 10;

    const label = isActive ? `${minRating} – ${maxRating}` : 'Nota';

    return (
        <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/50 px-3 py-1.5 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap">
                <Star
                    className={`size-3.5 transition-colors ${isActive ? 'fill-primary/80 text-primary/80' : ''}`}
                />
                <span className="text-xs tabular-nums">{label}</span>
            </div>
            <Slider
                value={[minRating, maxRating]}
                onValueChange={([min, max]) => setRatingRange(min, max)}
                min={0}
                max={10}
                step={1}
                className="w-28"
            />
        </div>
    );
}
