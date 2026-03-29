export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-card mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row item-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} CineDash. Dados fornecidos por{' '}
                            <a
                                href="https://www.themoviedb.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline cursor-pointer"
                            >
                                TMDB
                            </a>
                        </p>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors cursor-pointer"
                        >
                            GitHub
                        </a>
                        <span>•</span>
                        <a
                            href="https://www.themoviedb.org/documentation/api"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors cursor-pointer"
                        >
                            API Docs
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
