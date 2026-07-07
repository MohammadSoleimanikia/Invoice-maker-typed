// features/categories/hooks/useDeleteCategory.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return await apiFetch(`/user/categories/${id}/`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("دسته‌بندی با موفقیت حذف شد");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در حذف دسته‌بندی");
        },
    });
}
