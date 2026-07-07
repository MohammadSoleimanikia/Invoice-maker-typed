import { useQuery } from "@tanstack/react-query";

import type { CustomerInvoiceList } from "@/features/customers/types/customerReport";
import { apiFetch } from "@/features/shared/lib/api";

type UseCustomerInvoicesParams = {
    customerId: string;
    page?: number;
    pageSize?: number;
    status?: string;
};

export function useCustomerInvoices({
    customerId,
    page = 1,
    pageSize = 20,
    status = "all",
}: UseCustomerInvoicesParams) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("page_size", pageSize.toString());

    if (status && status !== "all") {
        params.append("status", status);
    }

    return useQuery({
        queryKey: ["customer-invoices", customerId, { page, status }],
        queryFn: async () => {
            const url = `/user/invoices/?customer_phone_number=${customerId}&${params.toString()}`;
            return await apiFetch<CustomerInvoiceList>(url);
        },
        enabled: !!customerId,
        staleTime: 2 * 60 * 1000,
    });
}
