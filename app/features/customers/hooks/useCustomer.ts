import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { Customer } from "../types/customer";

export function useCustomer(customerId: string | number) {
    return useQuery({
        queryKey: ["customer", customerId],
        queryFn: async () => {
            return await apiFetch<Customer>(
                `/account/customers/${customerId}/`,
            );
        },
        enabled: !!customerId,
        staleTime: 5 * 60 * 1000,
    });
}
