import type { PublicInvoice } from "@/features/invoices/types/invoice";

/** Response returned from GET /api/public/invoices/{token}/. */
export type PublicInvoiceResponse = PublicInvoice;

/** Nested invoice object inside the public response. */
export type PublicInvoiceDirectResponse = PublicInvoice["invoice"];
