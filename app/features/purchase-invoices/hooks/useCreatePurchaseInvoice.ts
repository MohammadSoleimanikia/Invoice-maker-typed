// app/features/purchase-invoices/hooks/useCreatePurchaseInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type {
    PurchaseInvoice,
    PurchaseInvoiceCreate,
} from "../types/purchaseInvoice.types";

export function useCreatePurchaseInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PurchaseInvoiceCreate) => {
            return await apiFetch<PurchaseInvoice>("/user/purchase-invoices/", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["purchase-invoices"],
            });

            toast.success("فاکتور خرید با موفقیت ایجاد شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در ایجاد فاکتور خرید");
        },
    });
}
