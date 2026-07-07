import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

export function useDeleteInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            return await apiFetch(`/user/invoices/${id}/`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            //remove cache after deletion of invoice
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
}
