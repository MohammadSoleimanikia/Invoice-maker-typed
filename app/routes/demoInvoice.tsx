import DemoInvoiceForm from "@/features/demoInvoice/components/demoNewInvoice";

export default function DemoInvoiceRoute() {
    return (
        <main className="min-h-svh bg-background p-4 md:p-6" dir="rtl">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">ساخت فاکتور دمو</h1>
                    <p className="mt-2 text-muted-foreground">
                        اطلاعات را به‌صورت محلی وارد کنید؛ هیچ داده‌ای برای سرور
                        ارسال نمی‌شود.
                    </p>
                </div>
                <DemoInvoiceForm />
            </div>
        </main>
    );
}
