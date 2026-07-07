// features/invoices/hooks/useUpdateInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type { InvoiceFormType } from "../schema/invoice.schema";
import type { Invoice } from "../types/invoicePreview.type";

export function useUpdateInvoice() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: InvoiceFormType;
        }) => {
            return await apiFetch<Invoice>(`/user/invoices/${id}/`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoice", id] });
            toast.success("فاکتور با موفقیت ویرایش شد!");
            navigate(`/invoices/${data.id}`);
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در ویرایش فاکتور");
        },
    });
}
