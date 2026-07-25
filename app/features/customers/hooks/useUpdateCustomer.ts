// features/customers/hooks/useUpdateCustomer.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiFetch } from "@/features/shared/lib/api";

import type { Customer, CustomerUpdate } from "../types/customer";

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: CustomerUpdate;
        }) => {
            return await apiFetch<Customer>(`/account/customers/${id}/`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            queryClient.invalidateQueries({
                queryKey: ["customer","customers"],
            });
            toast.success("مشتری با موفقیت ویرایش شد !");
        },
        onError: (error: any) => {
            console.error("Update customer error:", error);

            if (error?.response?.data) {
                const serverErrors = error.response.data;
                const firstError = Object.values(serverErrors)[0];
                toast.error(
                    Array.isArray(firstError)
                        ? firstError[0]
                        : "خطا در ویرایش مشتری",
                );
            } else {
                toast.error(error?.message || "خطا در ویرایش مشتری");
            }
        },
    });
}
