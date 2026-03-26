import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
    isAuthenticated: boolean;
    token: string | null;
    user: {
        email: string;
    } | null;
    login: (email: string, password: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            token: null,
            user: null,

            login: (email, password) => {
                // Simular autenticação sem backend
                const fakeToken = btoa(`${email}:${password}:${Date.now()}`);

                set({
                    isAuthenticated: true,
                    token: fakeToken,
                    user: { email },
                });
            },

            logout: () => {
                set({
                    isAuthenticated: false,
                    token: null,
                    user: null,
                });
            },
        }),
        {
            name: 'auth-storage',
        },
    ),
);
