import { useQuery } from "@tanstack/react-query";

import type {
    PaginatedProductList,
    Product,
} from "@/features/products/types/product";
import { apiFetch } from "@/features/shared/lib/api";

type UseProductParams = {
    search?: string;
    page?: number;
    pageSize?: number;
};
interface UseProductsReturn {
    products: Product[];
    count: number;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}
export function useProducts({
    page = 1,
    pageSize = 20,
    search = "",
}: UseProductParams): UseProductsReturn {
    // make params
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("page_size", pageSize.toString());

    if (search && search.trim()) {
        params.append("name", search.trim());
    }

    const { data, isLoading, error, refetch, isFetching, isError } = useQuery({
        queryKey: ["products", { search, page, pageSize }],
        queryFn: async () => {
            const url = `/user/products/?${params.toString()}`;
            return await apiFetch<PaginatedProductList>(url);
        },
        staleTime: 2 * 60 * 1000,
    });

    return {
        products: data?.results || [],
        count: data?.count || 0,
        isLoading,
        error,
        refetch,
        isFetching,
        isError,
    };
}
