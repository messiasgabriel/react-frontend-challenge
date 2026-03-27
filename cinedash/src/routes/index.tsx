import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';

export const Route = createFileRoute('/')({
    component: HomePage,
});

export function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-6 px-4">
                <h1 className="text-5xl font-bold">🎬 CineDash</h1>
                <p className="text-muted-foreground text-lg">
                    Dashboard de Curadoria de Filmes
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/login">
                        <Button size="lg">Começar</Button>
                    </Link>
                    <Button size="lg" variant="outline">
                        Saber Mais
                    </Button>
                </div>
            </div>
        </div>
    );
}
