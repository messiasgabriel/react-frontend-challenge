import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

type ErrorFallbackProps = {
    error: Error;
    resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        ⚠️ Algo deu errado
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-center">
                        Ocorreu um erro inesperado. Tente recarregar a página.
                    </p>

                    <details className="text-sm">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            Detalhes técnicos
                        </summary>
                        <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>

                    <div className="flex gap-2 justify-center pt-2">
                        <Button onClick={() => window.location.replace('/')}>
                            Voltar ao início
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Recarregar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
