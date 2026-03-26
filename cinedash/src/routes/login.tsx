import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
    component: LoginPage,
});

function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Login</h2>
                    <p className="mt-2 text-slate-400">
                        Acesse sua conta do CineDash
                    </p>
                </div>

                <div className="mt-8 space-y-6 bg-slate-900 p-8 rounded-lg">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-300"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
}
