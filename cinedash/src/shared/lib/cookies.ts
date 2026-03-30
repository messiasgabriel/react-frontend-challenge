const COOKIE_NAME = 'cinedash_token';

export function setCookie(token: string, maxAgeSeconds: number): void {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function getCookie(): string | null {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${COOKIE_NAME}=`));

    if (!match) return null;
    return decodeURIComponent(match.split('=')[1]);
}

export function deleteCookie(): void {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}
