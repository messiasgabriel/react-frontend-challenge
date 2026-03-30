const requiredEnv = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
    return value;
};

export const env = {
    TMDB_ACCESS_TOKEN: requiredEnv('VITE_TMDB_ACCESS_TOKEN'),
    JWT_SECRET: requiredEnv('VITE_JWT_SECRET'),
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
};
