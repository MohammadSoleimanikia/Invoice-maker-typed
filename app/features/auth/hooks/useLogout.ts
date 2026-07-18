import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import useAuth from "@/features/auth/store/authStore";
import { apiFetch } from "@/features/shared/lib/api";

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const logOut = useAuth((state) => state.logOut);

    return useMutation({
        mutationFn: async () => {
            return apiFetch("/account/logout/", {
                method: "POST",
                credentials: "include",
            });
        },

        onSettled: () => {
            logOut();
            queryClient.clear();
            navigate("/login", { replace: true });
        },
    });
}