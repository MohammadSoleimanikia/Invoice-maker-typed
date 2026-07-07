import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { Invoice } from "../types/invoicePreview.type";

type UseInvoiceReturn = {
    invoice: Invoice | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
};
export function useInvoice(id: string): UseInvoiceReturn {
    const {
        data: invoice,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["invoice", id],
        queryFn: async () => {
            if (!id) throw new Error("Invoice ID is required");
            return apiFetch<Invoice>(`/user/invoices/${id}/`);
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
    return {
        invoice: invoice || null,
        isLoading,
        isError: !!error,
        error: error || null,
        refetch,
    };
}
