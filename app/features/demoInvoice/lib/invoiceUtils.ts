import type {
    DemoInvoiceFormItem,
    DemoInvoiceFormType,
    DemoInvoiceItem,
} from "@/features/demoInvoice/types/demoInvoice";

export const calculateItemsSubtotal = (
    items: Array<{ price: number; quantity: number }>,
): number => {
    return items.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return sum + price * quantity;
    }, 0);
};

/**
 * Mirrors the payable amount used by dashboard invoices.
 */
export const calculateInvoiceTotal = (
    items: Array<{ price: number; quantity: number }>,
    addedValue = 0,
    discount = 0,
): number => {
    const subtotal = calculateItemsSubtotal(items);
    return Math.max(0, subtotal + Number(addedValue || 0) - Number(discount || 0));
};

export const transformFormItemsToInvoiceItems = (
    items: DemoInvoiceFormItem[],
): DemoInvoiceItem[] => {
    return items
        .filter((item) => item.product_name.trim())
        .map((item, index) => ({
            product: {
                id: index + 1,
                name: item.product_name.trim(),
                price: Number(item.price) || 0,
            },
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0,
        }));
};

export const getTodayDateString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const generateInvoiceId = (): string => `demo-${Date.now()}`;

export const getDefaultInvoiceFormValues = (): DemoInvoiceFormType => ({
    title: "فاکتور فروش",
    invoice_number: String(Date.now()).slice(-6),
    created: getTodayDateString(),

    seller_store_name: "",
    seller_store_description: "",
    seller_phone_number: "",
    seller_store_address: "",
    seller_insta_link: "",
    seller_hexcolor: "#2a8e9e",
    seller_logo: "",

    customer_name: "",
    customer_address: "",
    customer_email: "",
    customer_phone_number: "",

    descriptions: "",
    status: "pending",
    payment_mode: "cash",
    items: [{ product_name: "", quantity: 1, price: 0 }],
    added_value: 0,
    discount: 0,
});

export const isInvoiceFormValid = (items: DemoInvoiceFormItem[]): boolean => {
    return items.some(
        (item) =>
            item.product_name.trim().length > 0 &&
            Number(item.quantity) > 0 &&
            Number(item.price) >= 0,
    );
};
