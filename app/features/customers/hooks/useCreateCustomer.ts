import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type { Customer } from "../types/customer";

export function useCreateCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        // remove id from customer cause id created by the server
        mutationFn: async (data: Omit<Customer, "id">) => {
            return await apiFetch<Customer>("/account/customers/", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("مشتری با موفقیت افزوده شد !");
        },
        onError: (error: any) => {
            toast.error(error?.message || "خطا در افزودن مشتری ");
        },
    });
}
