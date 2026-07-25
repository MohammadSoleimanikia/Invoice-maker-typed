import type { MetaFunction } from "react-router";

import DemoInvoiceForm from "@/features/demoInvoice/components/demoNewInvoice";

const SITE_URL = "https://webfactor.ir";
const PAGE_URL = `${SITE_URL}/demo`;
const OG_IMAGE = `${SITE_URL}/image-og.webp`;

export const meta: MetaFunction = () => {
    const title = "ساخت رایگان فاکتور آنلاین دمو | وب فاکتور";

    const description =
        "بدون ثبت‌نام یک فاکتور آنلاین آزمایشی بسازید؛ اطلاعات مشتری و کالا، لوگو و رنگ برند را وارد کنید، فاکتور را در ۴ قالب زیبا طراحی کنید و پیش‌نمایش آن را بدون ارسال اطلاعات به سرور ببینید.";

    return [
        { title },
        {
            name: "description",
            content: description,
        },
        {
            name: "robots",
            content: "index, follow, max-image-preview:large",
        },
        {
            tagName: "link",
            rel: "canonical",
            href: PAGE_URL,
        },
        {
            property: "og:type",
            content: "website",
        },
        {
            property: "og:locale",
            content: "fa_IR",
        },
        {
            property: "og:site_name",
            content: "وب فاکتور",
        },
        {
            property: "og:title",
            content: title,
        },
        {
            property: "og:description",
            content: description,
        },
        {
            property: "og:url",
            content: PAGE_URL,
        },
        {
            property: "og:image",
            content: OG_IMAGE,
        },
        {
            name: "twitter:card",
            content: "summary_large_image",
        },
        {
            name: "twitter:title",
            content: title,
        },
        {
            name: "twitter:description",
            content: description,
        },
        {
            name: "twitter:image",
            content: OG_IMAGE,
        },
    ];
};

export default function DemoInvoiceRoute() {
    return (
        <main className="min-h-svh bg-background p-4 md:p-6" dir="rtl">
            <div className="mx-auto max-w-5xl">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">
                        ساخت رایگان فاکتور آنلاین دمو
                    </h1>

                    <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
                        اطلاعات مشتری و کالا را وارد کنید، لوگو و رنگ برند خود
                        را اضافه کنید و فاکتور را در یکی از ۴ قالب زیبا و
                        حرفه‌ای بسازید. همه اطلاعات فقط در مرورگر شما نگهداری
                        می‌شود و هیچ داده‌ای به سرور ارسال نمی‌شود.
                    </p>
                </header>

                <DemoInvoiceForm />
            </div>
        </main>
    );
}