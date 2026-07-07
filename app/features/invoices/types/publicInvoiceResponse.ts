import type { User } from "@/features/auth/types/user.type";
import type { Invoice } from "@/features/invoices/types/invoicePreview.type";

/**
 * Public API Response returned from `/api/public/invoices/{token}/`
 * This is the response structure when accessing an invoice with a public token
 */
export type PublicInvoiceResponse = {
    invoice_details: Invoice & {
        creator_details: User;
    };
};

/**
 * Simplified public invoice response (direct structure)
 * Some endpoints may return the invoice directly without nesting
 */
export type PublicInvoiceDirectResponse = Invoice & {
    creator_details?: User;
};
