// app/features/purchase-invoices/hooks/useCompletePurchaseInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

export function useCompletePurchaseInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await apiFetch(`/user/purchase-invoices/${id}/complete/`, {
                method: "POST",
            });
        },
        onSuccess: async (_data, id) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["purchase-invoices"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["purchase-invoice", id],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["products"],
                }),
                queryClient.invalidateQueries({ queryKey: ["products"] }),
                queryClient.invalidateQueries({
                    queryKey: ["product-batches"],
                }),
            ]);

            toast.success("فاکتور خرید با موفقیت تکمیل شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در تکمیل فاکتور خرید");
        },
    });
}
