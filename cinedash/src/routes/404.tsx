import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

export const Route = createFileRoute('/404')({
    component: NotFoundPage,
});

export function NotFoundPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
                <CardContent className="pt-12 pb-8 space-y-6">
                    <div className="text-8xl">🎬</div>

                    <div className="space-y-2">
                        <h1 className="text-6xl font-bold text-foreground">
                            404
                        </h1>
                        <h2 className="text-2xl font-semibold text-foreground">
                            Página não encontrada
                        </h2>
                    </div>

                    <p className="text-muted-foreground">
                        A página que você está procurando não existe ou foi
                        movida.
                    </p>

                    <div className="flex gap-3 justify-center pt-4">
                        <Link to="/dashboard" className="cursor-pointer">
                            <Button>Ir para Dashboard</Button>
                        </Link>
                        <Link to="/" className="cursor-pointer">
                            <Button variant="outline">Voltar ao Início</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
