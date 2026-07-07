/**
 * Public Invoice - returned from /api/public/invoices/{token}/
 * Has simplified structure with seller info at top level
 */
export type PublicInvoice = {
    invoice: {
        id: string;
        invoice_number: string;
        items: PublicInvoiceItem[];
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
    // Seller/Store Information
    id: number;
    creator: string | null;
    phone_number?: string;
    store_description: string | null;
    store_address: string | null;
    insta_link: string | null;
    hexcolor: string;
    logo: string | null; // Full URL path
    token: string;
    created_at: string;
    is_active: boolean;
};

/**
 * Public Invoice Item with simplified Product info
 */
export type PublicInvoiceItem = {
    product: {
        name: string;
        price: number;
    };
    price: number;
    quantity: number;
};
