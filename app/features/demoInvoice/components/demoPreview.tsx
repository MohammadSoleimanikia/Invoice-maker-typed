import { useState } from "react";
import { useNavigate } from "react-router";

import { useInvoiceStore } from "@/features/demoInvoice/store/demoInvoice";
import InvoicePreview from "@/features/invoices/components/invoicePreview";
import { TemplateSelector } from "@/features/invoices/components/templateSelector";
import type { TemplateType } from "@/features/invoices/types/invoicePreview.type";
import { Button } from "@/features/shared/components/ui/button";

export default function DemoInvoicePreview() {
    const navigate = useNavigate();
    const [template, setTemplate] = useState<TemplateType>("boutique");
    const invoice = useInvoiceStore((state) => state.invoice);
    const user = useInvoiceStore((state) => state.user);

    const handleNewInvoice = () => {
        useInvoiceStore.getState().clearPreviewData();
        navigate("/demo");
    };

    if (!invoice || !user) {
        return (
            <div className="flex min-h-svh items-center justify-center p-6">
                <div className="space-y-4 text-center">
                    <p className="text-lg text-muted-foreground">
                        اطلاعات فاکتور دمو پیدا نشد.
                    </p>
                    <Button onClick={() => navigate("/demo")}>
                        ساخت فاکتور دمو
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-3 p-4 print:hidden">
                <TemplateSelector
                    template={template}
                    setTemplate={setTemplate}
                />
                <Button onClick={() => window.print()}>چاپ</Button>
                <Button variant="outline" onClick={() => navigate("/demo")}>
                    ویرایش اطلاعات
                </Button>
                <Button variant="outline" onClick={handleNewInvoice}>
                    فاکتور جدید
                </Button>
                <Button variant="ghost" onClick={() => navigate("/")}>
                    بازگشت به خانه
                </Button>
            </div>

            <InvoicePreview
                invoice={invoice}
                user={user}
                template={template}
            />
        </>
    );
}
