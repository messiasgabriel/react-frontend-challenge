import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/shared/config/env';

export interface JwtPayload {
    sub: string;
    email: string;
    name: string;
    iss?: string;
    aud?: string;
    iat?: number;
    exp?: number;
}

function getSecret(): Uint8Array {
    return new TextEncoder().encode(env.JWT_SECRET);
}

export async function createToken(email: string): Promise<string> {
    const name = email.split('@')[0];

    return new SignJWT({ email, name } satisfies Pick<
        JwtPayload,
        'email' | 'name'
    >)
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(email)
        .setIssuer('cinedash')
        .setAudience('cinedash-app')
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret(), {
            issuer: 'cinedash',
            audience: 'cinedash-app',
        });

        return {
            sub: payload.sub ?? '',
            email: (payload as Record<string, unknown>).email as string,
            name: (payload as Record<string, unknown>).name as string,
            iss: payload.iss,
            aud: payload.aud as string | undefined,
            iat: payload.iat,
            exp: payload.exp,
        };
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn('[verifyToken] Token inválido:', error);
        }
        return null;
    }
}
