import type {
    InvoiceStatus,
    PaymentMode,
} from "@/features/invoices/constants/invoice";

/**
 * Product associated with an invoice item
 */
export type DemoProduct = {
    id: number;
    name: string;
};

/**
 * Item in an invoice
 */
export type DemoInvoiceItem = {
    id: number;
    product: DemoProduct;
    quantity: number;
    price: number;
};

/**
 * Complete invoice structure for demo mode
 */
export type DemoInvoice = {
    id: string;
    invoice_number: string;
    items: DemoInvoiceItem[];
    customer_name: string;
    customer_phone_number: string;
    customer_email: string;
    customer_address: string;
    descriptions?: string | null;
    added_value: number;
    discount: number;
    status: InvoiceStatus;
    payment_mode: PaymentMode;
    total_amount: number;
    created: string;
    updated: string;
    creator?: any; // For compatibility with Invoice type
};

/**
 * Form data for invoice items (before conversion to DemoInvoiceItem)
 */
export type DemoInvoiceFormItem = {
    product_name: string;
    quantity: number;
    price: number;
};

/**
 * Form data structure for creating/editing invoices
 */
export type DemoInvoiceFormType = {
    invoice_number: string;
    created: string;
    customer_name: string;
    customer_phone_number: string;
    customer_email: string;
    customer_address: string;
    descriptions?: string | null;
    status: InvoiceStatus;
    payment_mode: PaymentMode;
    items: DemoInvoiceFormItem[];
    added_value: number;
    discount: number;
};
