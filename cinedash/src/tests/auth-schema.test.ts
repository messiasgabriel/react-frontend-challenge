import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/features/auth/model/auth-schema';

describe('loginSchema', () => {
    describe('email', () => {
        it('aceita email válido', () => {
            const result = loginSchema.safeParse({ email: 'user@example.com', password: '123456' });
            expect(result.success).toBe(true);
        });

        it('rejeita email vazio com mensagem obrigatório', () => {
            const result = loginSchema.safeParse({ email: '', password: '123456' });
            expect(result.success).toBe(false);
            const messages = result.error!.issues.map((i) => i.message);
            expect(messages).toContain('Email é obrigatório');
        });

        it('rejeita email sem @', () => {
            const result = loginSchema.safeParse({ email: 'invalidemail', password: '123456' });
            expect(result.success).toBe(false);
            const messages = result.error!.issues.map((i) => i.message);
            expect(messages).toContain('Email inválido');
        });

        it('rejeita email sem domínio', () => {
            const result = loginSchema.safeParse({ email: 'user@', password: '123456' });
            expect(result.success).toBe(false);
        });
    });

    describe('password', () => {
        it('aceita senha com 6 caracteres (mínimo)', () => {
            const result = loginSchema.safeParse({ email: 'user@example.com', password: '123456' });
            expect(result.success).toBe(true);
        });

        it('aceita senha com mais de 6 caracteres', () => {
            const result = loginSchema.safeParse({ email: 'user@example.com', password: 'senha_segura_123' });
            expect(result.success).toBe(true);
        });

        it('rejeita senha com menos de 6 caracteres', () => {
            const result = loginSchema.safeParse({ email: 'user@example.com', password: '12345' });
            expect(result.success).toBe(false);
            const messages = result.error!.issues.map((i) => i.message);
            expect(messages).toContain('Senha deve ter no mínimo 6 caracteres');
        });

        it('rejeita senha vazia', () => {
            const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
            expect(result.success).toBe(false);
            const messages = result.error!.issues.map((i) => i.message);
            expect(messages).toContain('Senha deve ter no mínimo 6 caracteres');
        });
    });

    it('rejeita quando ambos os campos são inválidos', () => {
        const result = loginSchema.safeParse({ email: '', password: '' });
        expect(result.success).toBe(false);
        expect(result.error!.issues.length).toBeGreaterThanOrEqual(2);
    });

    it('retorna os dados tipados quando válido', () => {
        const result = loginSchema.safeParse({ email: 'admin@cinedash.com', password: 'secret123' });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data).toEqual({ email: 'admin@cinedash.com', password: 'secret123' });
        }
    });
});
