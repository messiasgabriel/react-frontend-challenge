import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: HomePage,
});

function HomePage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-bold text-white">🎬 CineDash</h1>
                <p className="text-slate-400 text-lg">
                    Dashboard de Curadoria de Filmes
                </p>
                <div className="flex gap-4 justify-center">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Começar
                    </button>
                    <button className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
                        Saber Mais
                    </button>
                </div>
            </div>
        </div>
    );
}
