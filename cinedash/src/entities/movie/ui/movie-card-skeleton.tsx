import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function MovieCardSkeleton() {
    return (
        <Card className="overflow-hidden bg-slate-900 border-slate-800">
            <Skeleton className="w-full aspect-2/3 bg-slate-800" />
            <CardContent className="p-3 space-y-2">
                <Skeleton className="h-4 w-full bg-slate-800" />
                <Skeleton className="h-4 w-3/4 bg-slate-800" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16 bg-slate-800" />
                    <Skeleton className="h-3 w-12 bg-slate-800" />
                </div>
            </CardContent>
        </Card>
    );
}
