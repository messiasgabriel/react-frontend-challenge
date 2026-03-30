// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createToken, verifyToken } from '@/features/auth/api/fake-auth';

describe('fake-auth', () => {
    describe('createToken', () => {
        it('retorna uma string não vazia', async () => {
            const token = await createToken('user@example.com');
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });

        it('retorna um JWT com 3 partes separadas por ponto', async () => {
            const token = await createToken('user@example.com');
            expect(token.split('.')).toHaveLength(3);
        });

        it('deriva o nome do email (parte antes do @)', async () => {
            const token = await createToken('joao@cinedash.com');
            const payload = await verifyToken(token);
            expect(payload?.name).toBe('joao');
        });

        it('inclui o email no payload', async () => {
            const token = await createToken('ana@example.com');
            const payload = await verifyToken(token);
            expect(payload?.email).toBe('ana@example.com');
        });
    });

    describe('verifyToken', () => {
        it('retorna payload válido para token legítimo', async () => {
            const token = await createToken('user@example.com');
            const payload = await verifyToken(token);

            expect(payload).not.toBeNull();
            expect(payload?.sub).toBe('user@example.com');
            expect(payload?.iss).toBe('cinedash');
        });

        it('retorna null para token inválido', async () => {
            const result = await verifyToken('token.invalido.qualquer');
            expect(result).toBeNull();
        });

        it('retorna null para string vazia', async () => {
            const result = await verifyToken('');
            expect(result).toBeNull();
        });

        it('retorna null para token com assinatura adulterada', async () => {
            const token = await createToken('user@example.com');
            const [header, payload] = token.split('.');
            const tampered = `${header}.${payload}.assinatura_falsa`;
            const result = await verifyToken(tampered);
            expect(result).toBeNull();
        });

        it('retorna null para token com issuer diferente', async () => {
            // JWT criado com issuer diferente não passa na verificação
            const { SignJWT } = await import('jose');
            const secret = new TextEncoder().encode('cinedash-dev-secret-key-min-32-chars!');
            const tokenWrongIssuer = await new SignJWT({ email: 'x@x.com', name: 'x' })
                .setProtectedHeader({ alg: 'HS256' })
                .setSubject('x@x.com')
                .setIssuer('outro-sistema')
                .setAudience('cinedash-app')
                .setIssuedAt()
                .setExpirationTime('24h')
                .sign(secret);

            const result = await verifyToken(tokenWrongIssuer);
            expect(result).toBeNull();
        });
    });
});
