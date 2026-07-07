import { useQuery } from "@tanstack/react-query";

import type { PaginatedInvoiceList } from "@/features/invoices/types/invoicePreview.type";
import { apiFetch } from "@/features/shared/lib/api";
export function useRecentInvoices(limit: number = 5) {
    return useQuery({
        queryKey: ["dashboard", "recent-Invoices", limit],
        queryFn: async () => {
            return await apiFetch<PaginatedInvoiceList>(
                `/user/invoices/?page=1&page_size=${limit}`,
            );
        },
        staleTime: 2 * 60 * 1000,
    });
}
