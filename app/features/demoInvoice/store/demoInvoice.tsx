/**
 * Demo invoice store using Zustand
 * Manages state for demo invoice creation and preview
 */

import { create } from "zustand";

import type {
    DemoInvoice,
    DemoInvoiceItem,
} from "@/features/demoInvoice/types/demoInvoice";

interface DemoInvoiceState {
    // State
    invoice: DemoInvoice | null;

    // Actions
    setInvoice: (invoice: DemoInvoice) => void;
    clearInvoice: () => void;
    addItem: (item: DemoInvoiceItem) => void;
    removeItem: (itemId: number) => void;
    updateItem: (item: DemoInvoiceItem) => void;
}

/**
 * Calculate total amount from invoice items
 * @param items - Array of items
 * @returns Total amount
 */
const calculateTotal = (items: DemoInvoiceItem[]): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * Demo invoice store
 * Provides invoice state management and operations
 */
export const useInvoiceStore = create<DemoInvoiceState>((set) => ({
    invoice: null,

    setInvoice: (invoice) => set({ invoice }),

    clearInvoice: () => set({ invoice: null }),

    addItem: (item) =>
        set((state) => {
            if (!state.invoice) return state;
            const items = [...state.invoice.items, item];
            return {
                invoice: {
                    ...state.invoice,
                    items,
                    total_amount: calculateTotal(items),
                },
            };
        }),

    removeItem: (itemId) =>
        set((state) => {
            if (!state.invoice) return state;
            const items = state.invoice.items.filter((i) => i.id !== itemId);
            return {
                invoice: {
                    ...state.invoice,
                    items,
                    total_amount: calculateTotal(items),
                },
            };
        }),

    updateItem: (updatedItem) =>
        set((state) => {
            if (!state.invoice) return state;
            const items = state.invoice.items.map((i) =>
                i.id === updatedItem.id ? updatedItem : i,
            );
            return {
                invoice: {
                    ...state.invoice,
                    items,
                    total_amount: calculateTotal(items),
                },
            };
        }),
}));
