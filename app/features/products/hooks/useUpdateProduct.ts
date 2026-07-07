import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type { Product, ProductCreate } from "../types/product";
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: ProductCreate;
        }) => {
            return await apiFetch<Product>(`/user/products/${id}/`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
            toast.success("کالا با موفقیت ویرایش شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در ویرایش کالا");
        },
    });
}
