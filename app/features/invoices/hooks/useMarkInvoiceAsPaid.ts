import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

export function useMarkInvoiceAsPaid() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            return await apiFetch(`/user/invoices/${id}/paid/`, {
                method: "POST",
            });
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["invoice", id] });
        },
    });
}
