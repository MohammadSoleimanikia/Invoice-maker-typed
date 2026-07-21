import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { User } from "@/features/auth/types/user.type";
import InvoicePreview from "@/features/invoices/components/invoicePreview";
import type { PublicInvoice } from "@/features/invoices/types/invoice";
import type { Invoice } from "@/features/invoices/types/invoicePreview.type";
import {
    DEFAULT_INVOICE_TEMPLATE,
    normalizeInvoiceTemplate,
    type TemplateType,
} from "@/features/invoices/types/template";
import { useTheme } from "@/features/shared/components/themeProvider";
import { Button } from "@/features/shared/components/ui/button";
import { apiFetch } from "@/features/shared/lib/api";

export default function PublicInvoice() {
    const { invoiceToken } = useParams<{ invoiceToken: string }>();
    const { theme, setTheme } = useTheme();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [template, setTemplate] = useState<TemplateType>(
        DEFAULT_INVOICE_TEMPLATE,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!invoiceToken) {
                setError("توکن فاکتور نامعتبر است");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await apiFetch<PublicInvoice>(
                    `/api/public/invoices/${invoiceToken}/`,
                );

                // Extract invoice from nested structure
                const invoiceData = response.invoice;

                if (!invoiceData || !invoiceData.id) {
                    console.error("Invoice data is invalid:", invoiceData);
                    setError("فاکتور یافت نشد یا دادهٔ نامعتبر است");
                    return;
                }

                // Map PublicInvoice data to Invoice format for templates
                setInvoice({
                    ...invoiceData,
                    descriptions:
                        invoiceData.descriptions ||
                        response.payment_description ||
                        "",
                });

                // The public API returns the store owner's selected template.
                // Older/missing/invalid values are normalized to boutique.
                const selectedTemplate = normalizeInvoiceTemplate(
                    response.template,
                );

                // Build user/creator object from seller info at top level
                const sellerInfo: User = {
                    id: response.id,
                    phone_number: response.phone_number || "",
                    first_name: response.creator?.split(" ")[0] || "",
                    last_name: response.creator?.split(" ")[1] || "",
                    date_joined: response.created_at,
                    profile: {
                        default_invoice_template: selectedTemplate,
                        store_name: response.creator || "فروشگاه",
                        store_description: response.store_description || "",
                        store_address: response.store_address || "",
                        insta_link: response.insta_link || "",
                        hexcolor: response.hexcolor || "#000000",
                        logo: response.logo || "",
                        payment_description:
                            response.payment_description || null,
                    },
                };

                setUser(sellerInfo);
                setTemplate(selectedTemplate);
            } catch (err: any) {
                console.error("Error fetching invoice:", err);
                setError(err?.message || "خطا در بارگذاری فاکتور");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [invoiceToken]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>در حال بارگذاری...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-4">
                <div className="text-red-500 text-center">
                    <p className="font-semibold">
                        فاکتوری با این لینک موجود نمی باشد
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        توکن: {invoiceToken}
                    </p>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>فاکتور یافت نشد</div>
            </div>
        );
    }

    return (
        <>
            <div className="my-4 mx-2 md:mx-5 flex gap-4 print:hidden items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>صدور فاکتور با</span>
                    <a
                        href="https://webfactor.ir"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:opacity-80 transition"
                    >
                        <img
                            src="/logo.svg"
                            alt="وب‌ فاکتور"
                            className="h-5 w-auto"
                        />
                    </a>
                </div>
                <div className="flex gap-4">
                    <Button onClick={() => window.print()}>چاپ</Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                            setTheme(theme === "dark" ? "light" : "dark")
                        }
                        title={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    </Button>
                </div>
            </div>
            <InvoicePreview
                invoice={invoice}
                user={user}
                template={template}
            />
        </>
    );
}
