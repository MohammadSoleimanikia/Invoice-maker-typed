// features/invoices/hooks/useInvoiceForEdit.ts
import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { Invoice } from "../types/invoicePreview.type";

export function useInvoiceForEdit(id?: string) {
    return useQuery({
        queryKey: ["invoice", id, "edit"],
        queryFn: async () => {
            if (!id) return null;
            return await apiFetch<Invoice>(`/user/invoices/${id}/`);
        },
        enabled: !!id,
        staleTime: 0, // فرم همیشه دیتای تازه میخواد
    });
}
