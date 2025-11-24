import { create } from 'zustand';
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../lib/firebase.config';

interface User {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

type AuthStore = {
    user: User | null;
    setUser: (user: User | null) => void;
    initAuthObserver: () => () => void;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
};

const useAuthStore = create<AuthStore>((set) => ({
    user: null,

    setUser: (user) => set({ user }),

    initAuthObserver: () => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (fbUser) => {
                if (fbUser) {
                    const userLogged: User = {
                        displayName: fbUser.displayName,
                        email: fbUser.email,
                        photoURL: fbUser.photoURL,
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
            await signInWithPopup(auth, facebookProvider);
        } catch (e) {
            console.error(e);
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

export default useAuthStore;
