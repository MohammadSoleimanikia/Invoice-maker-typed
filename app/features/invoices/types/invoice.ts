export type PublicInvoice = {
    id: number;
    invoice: {
        id: string;
        items: PublicInvoiceItem[];
        total_amount: number;
        public_token: string;
        title: string | null;
        invoice_number: string;
        customer_name: string | null;
        customer_phone_number: string | null;
        customer_email: string | null;
        customer_address: string | null;
        status: "pending" | "paid" | "cancelled";
        payment_mode: "cash" | "card" | "bank" | "others";
        descriptions: string | null;
        discount: number;
        added_value: number;
        created: string;
        updated: string;
    };
    creator: string | null;
    phone_number: string | null;
    store_description: string | null;
    store_address: string | null;
    insta_link: string | null;
    hexcolor: string | null;
    logo: string | null;
    payment_description: string | null;

    /**
     * Template selected by the store owner and returned by the public API.
     * It may be absent/null for older accounts, so the UI falls back to boutique.
     */
    template?: string | null;

    created_at: string;
    is_active: boolean;
};

export type PublicInvoiceItem = {
    product: {
        id: number;
        name: string;
        price: number;
    };
    quantity: number;
    price: number;
};
