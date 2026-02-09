import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define minimalist User type based on Google JWT + Role needs
export interface User {
    id?: string;
    email: string;
    name?: string;
    role?: string;
    picture?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => {
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                // "Clean Slate" Strategy

                // 1. Clear Internal State
                set({ user: null, token: null, isAuthenticated: false });

                // 2. Clear Storage (Aggressive)
                localStorage.clear();
                sessionStorage.clear();

                // 3. Force Redirect
                window.location.href = '/login';
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
