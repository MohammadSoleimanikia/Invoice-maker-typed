import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { User } from "../types/user.type";
type UseUserReturn = {
    user: User | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
};

export function useUser(): UseUserReturn {
    const {
        data: user,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            return await apiFetch<User>(`/account/profile/`);
        },
        staleTime: 30 * 60 * 1000, //30 min cause user is less prone to change
    });
    return { user: user || null, isLoading, isError: !!error, error, refetch };
}
