import { useQuery } from "@tanstack/react-query";

import type { User } from "@/features/auth/types/user.type";
import { apiFetch } from "@/features/shared/lib/api";

type UseProfileOptions = {
    enabled?: boolean;
};

export function useProfile({ enabled = true }: UseProfileOptions = {}) {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            return await apiFetch<User>("/account/profile/");
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    });
}
