import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";

import type { InvoiceFormType } from "../schema/invoice.schema";
import type { Invoice } from "../types/invoicePreview.type";
export function useCreateInvoice() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (data: InvoiceFormType) => {
            return await apiFetch<Invoice>("/user/invoices/", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey:['invoices',"dashboard","products"]})
            toast.success("فاکتور با موفقیت ساخته شد ");
            navigate(`/invoices/${data.id}`);

        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در ساخت فاکتور");
        },
    });
}
