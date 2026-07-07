import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Product, ProductCreate } from "@/features/products/types/product";
import { apiFetch } from "@/features/shared/lib/api";

export function useCreateProduct() {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (data: ProductCreate) => {
            return await apiFetch<Product>("/user/products/", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("کالا با موفقیت افزوده شد");
        },
        onError: (error: any) => {
            const message = error?.errors?.detail || error?.message;
            if (message?.includes("تکراری") || error?.status === 400) {
                toast.error("نام کالا نباید تکراری باشد");
            } else {
                toast.error(message || "خطا در افزودن کالا");
            }
        },
    });

    return {
        createProduct: mutateAsync,
        isCreating: isPending,
    };
}
