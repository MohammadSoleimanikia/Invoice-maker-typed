// lib/invoiceViewModel.ts
import num2persian from "num2persian";

import {
    invoiceStatusFa,
    paymentModeFa,
} from "@/features/invoices/constants/invoice";
import type { Invoice } from "@/features/invoices/types/invoicePreview.type";
import { formatPersianDateTime } from "@/features/shared/lib/dateFormatter";

import { phoneFormatter } from "../../shared/lib/utils";

type InvoiceViewModelProps = {
    invoice: Invoice;
    paymentDescription?: string | null;
};

export function buildInvoiceViewModel({
    invoice,
    paymentDescription,
}: InvoiceViewModelProps) {
    return {
        invoiceNumber: invoice.invoice_number,
        createdAt: formatPersianDateTime(invoice.created),
        customer: {
            name: invoice.customer_name,
            address: invoice.customer_address,
            phone: phoneFormatter(invoice.customer_phone_number),
            email: invoice.customer_email ?? "",
        },
        items: (invoice.items || []).map((item: any) => {
            return {
                name: item.product.name,
                quantity: item.quantity,
                unitPrice: item.price,
                total: Number(item.price) * item.quantity,
            };
        }),
        added_value: invoice.added_value,
        discount: invoice.discount,
        total: invoice.total_amount ?? 0,
        descriptions:
            invoice.descriptions?.trim() || paymentDescription?.trim() || "",
        title: invoice.title,
        totalText: invoice.total_amount
            ? num2persian(invoice.total_amount)
            : "صفر",
        statusText: invoice.status ? invoiceStatusFa[invoice.status] : "نامشخص",
        paymentText: invoice.payment_mode
            ? paymentModeFa[invoice.payment_mode]
            : "نامشخص",
    };
}
