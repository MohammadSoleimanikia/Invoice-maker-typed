import DemoInvoiceForm from "@/features/demoInvoice/components/demoNewInvoice";
import { PAGE_TITLES } from "@/features/shared/constants/i18n";

/**
 * Demo Invoice Creation Route
 * Allows users to create invoices without database
 */
export default function DemoInvoiceRoute() {
    return (
        <div className="min-h-svh p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    {PAGE_TITLES.CREATE_DEMO_INVOICE}
                </h1>
                <DemoInvoiceForm />
            </div>
        </div>
    );
}
