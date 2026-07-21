import type { User } from "@/features/auth/types/user.type";
import type {
    Invoice,
    InvoiceItem,
} from "@/features/invoices/types/invoicePreview.type";

export type DemoInvoice = Invoice;
export type DemoInvoiceItem = InvoiceItem;
export type DemoInvoiceSeller = User;

export type DemoInvoiceFormItem = {
    product_name: string;
    quantity: number;
    price: number;
};

export type DemoInvoiceFormType = {
    title: string;
    invoice_number: string;
    created: string;

    seller_store_name: string;
    seller_store_description: string;
    seller_phone_number: string;
    seller_store_address: string;
    seller_insta_link: string;
    seller_hexcolor: string;
    seller_logo: string;

    customer_name: string;
    customer_phone_number: string;
    customer_email: string;
    customer_address: string;

    descriptions: string;
    status: "pending" | "paid" | "cancelled";
    payment_mode: "cash" | "card" | "bank" | "others";
    items: DemoInvoiceFormItem[];
    added_value: number;
    discount: number;
};

export type DemoInvoicePreviewData = {
    invoice: DemoInvoice;
    user: DemoInvoiceSeller;
    formData: DemoInvoiceFormType;
};
