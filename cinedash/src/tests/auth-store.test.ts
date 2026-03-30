// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/model/auth-store';
import { createToken } from '@/features/auth/api/fake-auth';

// cookies dependem de document — mock em ambiente node
vi.mock('@/shared/lib/cookies', () => {
    let store: string | null = null;
    return {
        setCookie: vi.fn((_token: string) => { store = _token; }),
        getCookie: vi.fn(() => store),
        deleteCookie: vi.fn(() => { store = null; }),
        __setStore: (val: string | null) => { store = val; },
    };
});

import * as cookieModule from '@/shared/lib/cookies';

const resetStore = () =>
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });

describe('useAuthStore', () => {
    beforeEach(() => {
        resetStore();
        vi.mocked(cookieModule.deleteCookie)();
    });

    describe('login', () => {
        it('seta isAuthenticated como true após login', async () => {
            await useAuthStore.getState().login({ email: 'user@test.com', password: '123456' });
            expect(useAuthStore.getState().isAuthenticated).toBe(true);
        });

        it('popula user com email e nome derivado do email', async () => {
            await useAuthStore.getState().login({ email: 'joao@test.com', password: '123456' });
            const { user } = useAuthStore.getState();
            expect(user?.email).toBe('joao@test.com');
            expect(user?.name).toBe('joao');
        });

        it('chama setCookie com um token', async () => {
            await useAuthStore.getState().login({ email: 'user@test.com', password: '123456' });
            expect(cookieModule.setCookie).toHaveBeenCalledWith(expect.any(String), 86400);
        });

        it('seta isLoading como false após login', async () => {
            await useAuthStore.getState().login({ email: 'user@test.com', password: '123456' });
            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe('logout', () => {
        it('limpa user e isAuthenticated', async () => {
            await useAuthStore.getState().login({ email: 'user@test.com', password: '123456' });
            useAuthStore.getState().logout();
            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });

        it('chama deleteCookie', async () => {
            await useAuthStore.getState().login({ email: 'user@test.com', password: '123456' });
            vi.mocked(cookieModule.deleteCookie).mockClear();
            useAuthStore.getState().logout();
            expect(cookieModule.deleteCookie).toHaveBeenCalled();
        });
    });

    describe('restoreSession', () => {
        it('rehidrata user de token válido no cookie', async () => {
            const token = await createToken('ana@test.com');
            vi.mocked(cookieModule.getCookie).mockReturnValue(token);

            await useAuthStore.getState().restoreSession();

            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(true);
            expect(state.user?.email).toBe('ana@test.com');
            expect(state.user?.name).toBe('ana');
        });

        it('não autentica quando não há cookie', async () => {
            vi.mocked(cookieModule.getCookie).mockReturnValue(null);
            await useAuthStore.getState().restoreSession();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it('limpa cookie e não autentica com token inválido', async () => {
            vi.mocked(cookieModule.getCookie).mockReturnValue('token.invalido.aqui');
            vi.mocked(cookieModule.deleteCookie).mockClear();

            await useAuthStore.getState().restoreSession();

            expect(useAuthStore.getState().isAuthenticated).toBe(false);
            expect(cookieModule.deleteCookie).toHaveBeenCalled();
        });

        it('seta isLoading como false ao final', async () => {
            vi.mocked(cookieModule.getCookie).mockReturnValue(null);
            await useAuthStore.getState().restoreSession();
            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe('checkSession', () => {
        it('mantém sessão com token válido', async () => {
            const token = await createToken('user@test.com');
            vi.mocked(cookieModule.getCookie).mockReturnValue(token);
            useAuthStore.setState({ isAuthenticated: true });

            await useAuthStore.getState().checkSession();

            expect(useAuthStore.getState().isAuthenticated).toBe(true);
        });

        it('invalida sessão com token corrompido', async () => {
            vi.mocked(cookieModule.getCookie).mockReturnValue('token.corrompido.xxx');
            useAuthStore.setState({ isAuthenticated: true });

            await useAuthStore.getState().checkSession();

            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });

        it('invalida sessão sem cookie', async () => {
            vi.mocked(cookieModule.getCookie).mockReturnValue(null);
            useAuthStore.setState({ isAuthenticated: true });

            await useAuthStore.getState().checkSession();

            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });
    });
});
