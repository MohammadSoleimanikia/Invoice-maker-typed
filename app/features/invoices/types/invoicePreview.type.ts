import type { User } from "@/features/auth/types/user.type";

export type TemplateType = "classic" | "modern" | "minimal" | "boutique";

/**
 * The templates only need a small subset of the product object.
 * API products with extra fields remain structurally compatible, while
 * locally-created demo products no longer need unsafe `as any` casts.
 */
export type InvoiceItemProduct = {
    id: number;
    name: string;
    price?: number;
};

/**
 * Private Invoice Item with the fields required by the invoice templates.
 */
export type InvoiceItem = {
    product: InvoiceItemProduct;
    price: number;
    quantity: number;
};

/**
 * Private invoice preview, used by authenticated and local demo invoices.
 */
export type Invoice = {
    id: string;
    invoice_number: string;
    creator_details?: User;
    items: InvoiceItem[];
    total_amount: number;
    customer_name?: string | null;
    customer_phone_number?: string | null;
    customer_email?: string | null;
    customer_address?: string | null;
    descriptions?: string | null;
    title?: string | null;
    public_token: string;
    status?: "pending" | "paid" | "cancelled";
    payment_mode?: "cash" | "card" | "bank" | "others";
    created: string;
    updated: string;
    added_value: number;
    discount: number;
};

/**
 * Returned data type from /user/invoices/.
 */
export type PaginatedInvoiceList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Invoice[];
};

export type InvoiceViewModel = {
    invoiceNumber: string;
    createdAt: string;
    customer: {
        name: string | null | undefined;
        address: string | null | undefined;
        phone: string | null | undefined;
        email: string;
    };
    items: {
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    total: number;
    added_value: number;
    discount: number;
    descriptions: string | null | undefined;
    title: string | null | undefined;
    totalText: string;
    statusText: string;
    paymentText: string;
};
