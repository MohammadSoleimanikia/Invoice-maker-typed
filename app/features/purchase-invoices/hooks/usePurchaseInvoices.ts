// features/purchase-invoices/hooks/usePurchaseInvoices.ts
import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { PaginatedPurchaseInvoiceList } from "../types/purchaseInvoice.types";

type UsePurchaseInvoicesParams = {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    status?: string;
};

export function usePurchaseInvoices({
    page = 1,
    pageSize = 20,
    searchQuery = "",
    status = "all",
}: UsePurchaseInvoicesParams = {}) {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("page_size", pageSize.toString());

    // فرمت سرچ از route:
    // supplier=xxx&phone=yyy&invoice=zzz
    if (searchQuery.trim()) {
        const parts = searchQuery.split("&");

        for (const part of parts) {
            if (part.startsWith("supplier=")) {
                const supplierName = decodeURIComponent(
                    part.replace("supplier=", ""),
                );

                if (supplierName) {
                    params.append("supplier_name", supplierName);
                }
            }

            if (part.startsWith("phone=")) {
                const supplierPhone = decodeURIComponent(
                    part.replace("phone=", ""),
                );

                if (supplierPhone) {
                    params.append("supplier_phone", supplierPhone);
                }
            }

            if (part.startsWith("invoice=")) {
                const invoiceNumber = decodeURIComponent(
                    part.replace("invoice=", ""),
                );

                if (invoiceNumber) {
                    params.append("invoice_number", invoiceNumber);
                }
            }
        }
    }

    if (status && status !== "all") {
        params.append("status", status);
    }

    return useQuery<PaginatedPurchaseInvoiceList>({
        queryKey: [
            "purchase-invoices",
            {
                page,
                pageSize,
                searchQuery,
                status,
            },
        ],
        queryFn: async () => {
            return await apiFetch<PaginatedPurchaseInvoiceList>(
                `/user/purchase-invoices/?${params.toString()}`,
            );
        },
        staleTime: 2 * 60 * 1000,
    });
}
