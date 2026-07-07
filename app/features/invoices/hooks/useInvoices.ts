// features/invoices/hooks/useInvoices.ts
import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { PaginatedInvoiceList } from "../types/invoicePreview.type";

type UseInvoiceParams = {
    searchQuery?: string;
    status?: string;
    page?: number;
    pageSize: number;
};

export function useInvoices({
    page = 1,
    pageSize = 20,
    searchQuery = "",
    status = "all",
}: UseInvoiceParams) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("page_size", pageSize.toString());

    // ✅ پردازش جستجو - فرمت: customer=xxx&invoice=yyy
    if (searchQuery && searchQuery.trim()) {
        const parts = searchQuery.split("&");
        for (const part of parts) {
            if (part.startsWith("customer=")) {
                const customerName = decodeURIComponent(
                    part.replace("customer=", ""),
                );
                if (customerName) {
                    params.append("customer_name", customerName);
                }
            } else if (part.startsWith("invoice=")) {
                const invoiceNum = decodeURIComponent(
                    part.replace("invoice=", ""),
                );
                if (invoiceNum) {
                    params.append("invoice_number", invoiceNum);
                }
            }
        }
    }

    if (status && status !== "all") {
        params.append("status", status);
    }

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["invoices", { searchQuery, status, page, pageSize }],
        queryFn: async () => {
            const url = `/user/invoices/?${params.toString()}`;
            console.log("Search URL:", url); // برای دیباگ
            return await apiFetch<PaginatedInvoiceList>(url);
        },
        staleTime: 2 * 60 * 1000,
    });

    return {
        invoices: data?.results || [],
        count: data?.count || 0,
        isLoading,
        error,
        refetch,
    };
}
