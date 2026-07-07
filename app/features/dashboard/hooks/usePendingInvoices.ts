import { useQuery } from "@tanstack/react-query";

import type { PaginatedInvoiceList } from "@/features/invoices/types/invoicePreview.type";
import { apiFetch } from "@/features/shared/lib/api";
export function usePendingInvoices(limit: number = 5) {
    return useQuery({
        queryKey: ["dashboard", "pending-invoices", limit],
        queryFn: async () => {
            return await apiFetch<PaginatedInvoiceList>(
                `/user/invoices/?page=1&page_size=${limit}&status=pending`,
            );
        },
        staleTime: 2 * 60 * 1000,
    });
}
