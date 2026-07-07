// features/auth/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthContextType } from "@/features/auth/types/authContext";
import type { Token } from "@/features/auth/types/token";

const useAuth = create<AuthContextType>()(
    persist(
        (set) => ({
            token: null,

            logIn: (token: Token) => {
                set({ token });
            },

            logOut: () => {
                set({ token: null });
            },
        }),
        {
            name: "auth",
        },
    ),
);

export default useAuth;
