import { create } from "zustand";

import type {
    DemoInvoice,
    DemoInvoiceFormType,
    DemoInvoicePreviewData,
    DemoInvoiceSeller,
} from "@/features/demoInvoice/types/demoInvoice";

type DemoInvoiceState = {
    invoice: DemoInvoice | null;
    user: DemoInvoiceSeller | null;
    formData: DemoInvoiceFormType | null;
    setPreviewData: (data: DemoInvoicePreviewData) => void;
    clearPreviewData: () => void;
};

/**
 * Local-only demo state. No API request is made from this store.
 */
export const useInvoiceStore = create<DemoInvoiceState>((set) => ({
    invoice: null,
    user: null,
    formData: null,

    setPreviewData: ({ invoice, user, formData }) =>
        set({ invoice, user, formData }),

    clearPreviewData: () =>
        set({ invoice: null, user: null, formData: null }),
}));
