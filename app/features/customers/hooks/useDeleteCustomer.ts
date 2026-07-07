import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";
export function useDeleteCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            return await apiFetch(`/account/customers/${id}/`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("مشتری با موفقیت  حذف شد !");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در حذف مشتری");
        },
    });
}
