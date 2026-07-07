import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { PaginatedCustomerList } from "../types/customer";
type useCustomersParams = {
    page?: number;
    pageSize?: number;
};
export function useCustomers({ page = 1, pageSize = 20 }: useCustomersParams) {
    return useQuery({
        queryKey: ["customers", { page, pageSize }],
        queryFn: async () => {
            return await apiFetch<PaginatedCustomerList>(
                `/account/customers/?page=${page}&page_size=${pageSize}`,
            );
        },
        staleTime: 5 * 60 * 1000,
    });
}
