import { useState } from "react";
import { useParams } from "react-router";

import { useUser } from "@/features/auth/hooks/useUser";
import InvoicePreview from "@/features/invoices/components/invoicePreview";
import SharePublicLinkDialog from "@/features/invoices/components/sharePublicLinkDialog";
import { TemplateSelector } from "@/features/invoices/components/templateSelector";
import { useInvoice } from "@/features/invoices/hooks/useInvoice";
import type { TemplateType } from "@/features/invoices/types/invoicePreview.type";
import { Button } from "@/features/shared/components/ui/button";
import LoadingSpinner from "@/features/shared/components/ui/loadingSpinner";
export default function Invoice() {
    const { id } = useParams<{ id: string }>();
    const {
        invoice,
        isLoading: isInvoiceLoading,
        isError: isInvoiceError,
        error: invoiceError,
    } = useInvoice(id as string);
    const { user, isLoading: isUserLoading } = useUser();

    const [template, setTemplate] = useState<TemplateType>("boutique");
    if (isInvoiceLoading || isUserLoading) return <LoadingSpinner />;
    if (isInvoiceError) {
        return (
            <div className="text-red-500 text-center py-10">
                خطا: {invoiceError?.message || "بارگذاری فاکتور ناموفق بود!"}
            </div>
        );
    }
    if (!invoice)
        return <div className="text-center py-10">فاکتور پیدا نشد</div>;

    return (
        <>
            <div className="mb-4 flex gap-4 print:hidden">
                <TemplateSelector
                    setTemplate={setTemplate}
                    template={template}
                />
                <Button onClick={() => window.print()}>چاپ</Button>
                <SharePublicLinkDialog invoiceToken={invoice.public_token} />
            </div>

            <InvoicePreview user={user} invoice={invoice} template={template} />
        </>
    );
}
