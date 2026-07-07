/**
 * Utility functions for invoice operations
 * Centralizes business logic to follow DRY principles
 */

import {
    InvoiceStatus,
    PaymentMode,
} from "@/features/invoices/constants/invoice";
import type {
    DemoInvoiceFormType,
    DemoInvoiceItem,
} from "@/features/demoInvoice/types/demoInvoice";

/**
 * Calculate total amount from invoice items
 * @param items - Array of invoice items
 * @returns Total amount
 */
export const calculateInvoiceTotal = (
    items: Array<{ price: number; quantity: number }>,
): number => {
    return items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0,
    );
};

/**
 * Transform form data items into invoice items
 * @param items - Form items
 * @returns Transformed invoice items
 */
export const transformFormItemsToInvoiceItems = (
    items: Array<{ product_name: string; quantity: number; price: number }>,
): DemoInvoiceItem[] => {
    return items
        .filter((item) => item.product_name.trim())
        .map((item, index) => ({
            id: index,
            product: { id: index, name: item.product_name },
            quantity: item.quantity || 1,
            price: item.price || 0,
        }));
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export const getTodayDateString = (): string => {
    return new Date().toISOString().split("T")[0];
};

/**
 * Get current timestamp in ISO format
 * @returns ISO timestamp
 */
export const getCurrentTimestamp = (): string => {
    return new Date().toISOString();
};

/**
 * Generate unique invoice ID
 * @returns Unique ID
 */
export const generateInvoiceId = (): string => {
    return `demo-${Date.now()}`;
};

/**
 * Get default form values for new invoice
 * @returns Default form values
 */
export const getDefaultInvoiceFormValues = (): DemoInvoiceFormType => ({
    invoice_number: "",
    created: getTodayDateString(),
    customer_name: "",
    customer_address: "",
    customer_email: "",
    customer_phone_number: "",
    descriptions: "",
    status: InvoiceStatus.PENDING,
    payment_mode: PaymentMode.CASH,
    items: [{ product_name: "", quantity: 1, price: 0 }],

    added_value: 0, // ← اضافه شد
    discount: 0, // ← اضافه شد
});

/**
 * Validate invoice form data
 * @param items - Form items to validate
 * @returns True if valid, false otherwise
 */
export const isInvoiceFormValid = (
    items: Array<{ product_name: string }>,
): boolean => {
    return items.some((item) => item.product_name.trim());
};
