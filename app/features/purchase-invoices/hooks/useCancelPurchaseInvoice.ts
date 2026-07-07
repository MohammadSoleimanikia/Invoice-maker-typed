// app/features/purchase-invoices/hooks/useCancelPurchaseInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

export function useCancelPurchaseInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await apiFetch(`/user/purchase-invoices/${id}/cancel/`, {
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
            ]);

            toast.success("فاکتور خرید با موفقیت لغو شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در لغو فاکتور خرید");
        },
    });
}
