import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function MovieCardSkeleton() {
    return (
        <Card className="overflow-hidden bg-card border-border">
            <Skeleton className="w-full aspect-2/3" />
            <CardContent className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </CardContent>
        </Card>
    );
}
