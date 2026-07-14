import { create } from "zustand";

type AuthState = {
    isAuthenticated: boolean;
    logIn: () => void;
    logOut: () => void;
};

const useAuth = create<AuthState>((set) => ({
    isAuthenticated: false,

    logIn: () => {
        set({ isAuthenticated: true });
    },

    logOut: () => {
        set({ isAuthenticated: false });
    },
}));

export default useAuth;