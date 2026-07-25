// features/categories/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { PaginatedCategoryList } from "../types/category.types";

export function useCategories({ page = 1, pageSize = 100, search = "" } = {}) {
    
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("page_size", pageSize.toString());
    if (search) params.append("name", search);
    return useQuery({
        queryKey: ["categories", { page, pageSize, search }],
        queryFn: async () => {
            return await apiFetch<PaginatedCategoryList>(
                `/user/categories/?${params.toString()}`,
            );
        }, 
        staleTime: 5 * 60 * 1000,
    });
}
