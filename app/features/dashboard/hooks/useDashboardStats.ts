import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { DashboardData } from "../types/dashboard.type";
export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            return await apiFetch<DashboardData>(`/user/dashboard/`);
        },
        staleTime: 5 * 60 * 1000,
    });
}
