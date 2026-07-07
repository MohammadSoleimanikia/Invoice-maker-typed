// features/categories/hooks/useUpdateCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type { CategoryCreate } from "../types/category.types";

export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number;
            data: CategoryCreate;
        }) => {
            return await apiFetch(`/user/categories/${id}/`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("دسته‌بندی با موفقیت ویرایش شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در ویرایش دسته‌بندی");
        },
    });
}
