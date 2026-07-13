import type { User } from "@/features/auth/types/user.type";
import Boutique from "@/features/invoices/components/templates/boutique";
import Classic from "@/features/invoices/components/templates/classic";
import Minimal from "@/features/invoices/components/templates/minimal";
import Modern from "@/features/invoices/components/templates/modern";
import { buildInvoiceViewModel } from "@/features/invoices/libs/invoiceViewModel";
import Zoomable from "@/features/shared/components/zoomable";

import type { Invoice } from "../types/invoicePreview.type";

type InvoicePreviewProps = {
    template: "classic" | "modern" | "minimal" | "boutique";
    invoice: Invoice;
    user: User | null;
};
export default function InvoicePreview({
    template,
    invoice,
    user,
}: InvoicePreviewProps) {
    const viewModel = buildInvoiceViewModel({ invoice });
    return (
        <div
            className="
                            relative
                            w-full min-h-screen
                            overflow-hidden
                            bg-muted p-5
                            flex justify-center items-start
                            dark:bg-muted-foreground
                            print:text-black print:bg-white print:p-0 print:m-0 print:overflow-visible
                        "
        >
            <Zoomable>
                <div className="w-screen h-screen">
                    {template === "classic" ? (
                        <Classic invoice={viewModel} user={user} />
                    ) : template === "modern" ? (
                        <Modern invoice={viewModel} user={user} />
                    ) : template === "boutique" ? (
                        <Boutique invoice={viewModel} user={user} />
                    ) : (
                        <Minimal invoice={viewModel} user={user} />
                    )}
                </div>
            </Zoomable>
        </div>
    );
}
