// src/features/products/hooks/useDeleteProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

interface ErrorResponse {
    status?: number;
    message?: string;
    errors?: {
        detail?: string;
    };
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            return await apiFetch(`/user/products/${id}/`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("محصول با موفقیت حذف شد");
        },
        onError: (error: ErrorResponse) => {
            const detailMessage = error?.errors?.detail || error?.message;

            if (
                error?.status === 403 ||
                detailMessage?.includes("استفاده شده")
            ) {
                toast.error(
                    "این محصول در فاکتورهای صادر شده استفاده شده است و قابل حذف نمی‌باشد",
                );
            } else if (detailMessage) {
                toast.error(detailMessage);
            } else {
                toast.error("خطا در حذف محصول");
            }
        },
    });

    return {
        deleteProduct: mutation.mutateAsync,
        isDeleting: mutation.isPending,
    };
}
