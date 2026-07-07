// app/features/purchase-invoices/hooks/useUpdatePurchaseInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type {
    PurchaseInvoice,
    PurchaseInvoiceUpdate,
} from "../types/purchaseInvoice.types";

export function useUpdatePurchaseInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: PurchaseInvoiceUpdate;
        }) => {
            return await apiFetch<PurchaseInvoice>(
                `/user/purchase-invoices/${id}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify(data),
                },
            );
        },
        onSuccess: async (_data, variables) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["purchase-invoices"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["purchase-invoice", variables.id],
                }),
            ]);

            toast.success("فاکتور خرید با موفقیت ویرایش شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در ویرایش فاکتور خرید");
        },
    });
}
