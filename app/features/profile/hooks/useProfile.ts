import { useQuery } from "@tanstack/react-query";

import type { User } from "@/features/auth/types/user.type";
import { apiFetch } from "@/features/shared/lib/api";

export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const data = await apiFetch<User>("/account/profile/");
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });
}
