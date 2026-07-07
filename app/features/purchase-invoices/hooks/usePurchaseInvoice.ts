// app/features/purchase-invoices/hooks/usePurchaseInvoice.ts
import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { PurchaseInvoice } from "../types/purchaseInvoice.types";

export function usePurchaseInvoice(id: string) {
    return useQuery<PurchaseInvoice>({
        queryKey: ["purchase-invoice", id],
        queryFn: async () => {
            return await apiFetch<PurchaseInvoice>(
                `/user/purchase-invoices/${id}/`,
            );
        },
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
}
