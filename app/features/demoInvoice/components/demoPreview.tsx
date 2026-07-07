import { useNavigate } from "react-router";

import { buildInvoiceViewModel } from "@/features/invoices/libs/invoiceViewModel";
import { BUTTON_LABELS, MESSAGES } from "@/features/shared/constants/i18n";
import { useInvoiceStore } from "@/features/demoInvoice/store/demoInvoice";

import Minimal from "../../invoices/components/templates/minimal";
import { Button } from "../../shared/components/ui/button";
import { FormActions } from "../../shared/components/ui/form-fields";

/**
 * Demo invoice preview component
 * Displays invoice in minimal template with print and navigation options
 */
export default function DemoInvoicePreview() {
    const navigate = useNavigate();
    const invoice = useInvoiceStore((state) => state.invoice);

    if (!invoice) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">
                        {MESSAGES.ERROR.NOT_FOUND}
                    </p>
                </div>
            </div>
        );
    }

    const viewModel = buildInvoiceViewModel({ invoice: invoice as any });

    /**
     * Handle creating new invoice
     * Clears store and navigates back to form
     */
    const handleNewInvoice = () => {
        useInvoiceStore.getState().clearInvoice();
        navigate("/demo");
    };

    return (
        <>
            <div className="mb-4 print:hidden px-4 py-2">
                <FormActions>
                    <Button onClick={() => window.print()}>
                        {BUTTON_LABELS.PRINT}
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        {BUTTON_LABELS.BACK_TO_HOME}
                    </Button>
                    <Button variant="outline" onClick={handleNewInvoice}>
                        {BUTTON_LABELS.NEW_INVOICE}
                    </Button>
                </FormActions>
            </div>

            <div className="overflow-x-scroll bg-muted p-5 space-y-3 print:text-black print:bg-white print:p-0 print:m-0 print:overflow-visible">
                <Minimal invoice={viewModel} user={null} />
            </div>
        </>
    );
}
