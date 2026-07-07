// features/categories/hooks/useCreateCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type { CategoryCreate } from "../types/category.types";

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CategoryCreate) => {
            return await apiFetch("/user/categories/", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("دسته‌بندی با موفقیت ایجاد شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در ایجاد دسته‌بندی");
        },
    });
}
