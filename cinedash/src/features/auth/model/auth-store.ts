import { create } from 'zustand';
import { createToken, verifyToken } from '../api/fake-auth';
import { setCookie, getCookie, deleteCookie } from '@/shared/lib/cookies';
import type { LoginFormData } from './auth-schema';

export interface AuthUser {
    email: string;
    name: string;
}

interface AuthStore {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (data: LoginFormData) => Promise<void>;
    logout: () => void;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (data) => {
        const token = await createToken(data.email);
        setCookie(token, 86400); // 24h

        const name = data.email.split('@')[0];
        set({
            user: { email: data.email, name },
            isAuthenticated: true,
            isLoading: false,
        });
    },

    logout: () => {
        deleteCookie();
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    restoreSession: async () => {
        set({ isLoading: true });
        const token = getCookie();

        if (!token) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
        }

        const payload = await verifyToken(token);

        if (!payload) {
            deleteCookie();
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
        }

        set({
            user: { email: payload.email, name: payload.name },
            isAuthenticated: true,
            isLoading: false,
        });
    },
}));
