import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut, FacebookAuthProvider } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../lib/firebase.config';

interface User {
    displayName: string | null;
    email: string | null;
}

type AuthStore = {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    initAuthObserver: () => () => void;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<{ displayName?: string | null; email?: string | null } | void>;
    logout: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
};

const useAuthStore = create<AuthStore>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    clearUser: () => set({ user: null }),

    initAuthObserver: () => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (fbUser) => {
                if (fbUser) {
                    const userLogged: User = {
                        displayName: fbUser.displayName,
                        email: fbUser.email
                    };
                    set({ user: userLogged });
                } else {
                    set({ user: null });
                }
            },
            (err) => {
                console.error(err);
            }
        );

        return unsubscribe;
    },

    loginWithEmail: async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            console.error(e);
        }
    
    },

    loginWithGoogle: async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (e) {
            console.error(e);
        }
    },
    
    loginWithFacebook: async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const info = { displayName: result.user.displayName, email: result.user.email };
            // update zustand store so components react immediately
            set({ user: { displayName: info.displayName ?? null, email: info.email ?? null } });
            return info;
        } catch (e: any) {
            console.error(e);
            
            if (e?.code === 'auth/account-exists-with-different-credential') {
                const email = e.customData?.email || e.email;
                try {
                    const pendingCred = FacebookAuthProvider.credentialFromError(e);
                    const accessToken = (pendingCred as any)?.accessToken;
                    if (accessToken) {
                        const resp = await fetch(
                            `https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`
                        );
                        const profile = await resp.json();
                        const info = { displayName: profile.name ?? null, email: profile.email ?? email };
                        set({ user: { displayName: info.displayName ?? null, email: info.email ?? null } });
                        return info;
                    }
                } catch (graphErr) {
                    console.warn('Failed to fetch Facebook profile from access token', graphErr);
                }
                // fallback: set email only
                set({ user: { displayName: null, email: email ?? null } });
                return { email };
            }
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (e) {
            console.error(e);
        }
    }
}));

export const clearAuthUser = () => useAuthStore.getState().clearUser();

export default useAuthStore;