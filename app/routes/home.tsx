// app/routes/home.tsx

import { CTA } from "@/features/home/components/cta";
import { Features } from "@/features/home/components/features";
import { Footer } from "@/features/home/components/footer";
import { Header } from "@/features/home/components/header";
import { Hero } from "@/features/home/components/hero";
import { SalesWorkflow } from "@/features/home/components/salesWorkflow";
import { TemplateShowcase } from "@/features/home/components/templateShowcase";
import { PlansList } from "@/features/subscription/components/PlansList";

const SITE_URL = "https://webfactor.ir";
const STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "وب فاکتور",
            url: `${SITE_URL}/`,
            logo: `${SITE_URL}/logo.svg`,
            image: `${SITE_URL}/image-og.webp`,
            sameAs: ["https://t.me/webfactor_ir", "https://ble.ir/webfactor"],
            contactPoint: {
                "@type": "ContactPoint",
                telephone: "+98-938-705-1245",
                contactType: "customer support",
                availableLanguage: "Persian",
            },
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "وب فاکتور",
            url: `${SITE_URL}/`,
            inLanguage: "fa-IR",
            publisher: {
                "@id": `${SITE_URL}/#organization`,
            },
        },
        {
            "@type": "SoftwareApplication",
            "@id": `${SITE_URL}/#software`,
            name: "وب فاکتور",
            url: `${SITE_URL}/`,
            image: `${SITE_URL}/image-og.webp`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            inLanguage: "fa-IR",
            description:
                "سامانه آنلاین صدور و ارسال فاکتور، مدیریت مشتریان، کالاها، موجودی FIFO، خرید، فروش و گزارش‌های مالی با چهار قالب حرفه‌ای و برندینگ اختصاصی.",
            provider: {
                "@id": `${SITE_URL}/#organization`,
            },
            featureList: [
                "ساخت و ارسال فاکتور آنلاین",
                "چهار قالب حرفه‌ای فاکتور",
                "درج لوگو و رنگ برند",
                "مدیریت مشتریان",
                "مدیریت کالا و دسته‌بندی",
                "مدیریت موجودی FIFO",
                "ثبت فاکتور خرید",
                "گزارش‌های مالی و فروش",
                "افزودن کالا با بارکدخوان",
                "ارسال لینک عمومی فاکتور",
            ],
        },
    ],
};
const TITLE = "ساخت فاکتور آنلاین رایگان و حرفه‌ای | وب فاکتور";

const DESCRIPTION =
    "با وب فاکتور، فاکتور فروش حرفه‌ای بسازید، چاپ کنید و برای مشتری ارسال کنید. مناسب فروشگاه‌ها، شرکت‌ها و کسب‌وکارهای آنلاین.";

export function meta() {
    return [
        { title: TITLE },

        {
            name: "description",
            content: DESCRIPTION,
        },

        {
            name: "robots",
            content: "index, follow, max-image-preview:large",
        },

        {
            name: "googlebot",
            content: "index, follow, max-image-preview:large",
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
            content: TITLE,
        },
        {
            property: "og:description",
            content: DESCRIPTION,
        },
        {
            property: "og:url",
            content: SITE_URL,
        },
        {
            property: "og:image",
            content: `${SITE_URL}/image-og.webp`,
        },
        {
            property: "og:image:alt",
            content: "سامانه ساخت فاکتور آنلاین وب فاکتور",
        },

        {
            name: "twitter:card",
            content: "summary_large_image",
        },
        {
            name: "twitter:title",
            content: TITLE,
        },
        {
            name: "twitter:description",
            content: DESCRIPTION,
        },
        {
            name: "twitter:image",
            content: `${SITE_URL}/image-og.webp`,
        },

        {
            name: "theme-color",
            content: "#2a8e9e",
        },
    ];
}

export function links() {
    return [
        {
            rel: "canonical",
            href: `${SITE_URL}/`,
        },
    ];
}

export default function Home() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(STRUCTURED_DATA).replace(
                        /</g,
                        "\\u003c",
                    ),
                }}
            />
            <Header />
            <Hero />
            <Features />
            <TemplateShowcase />

            <section className="bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            تعرفه‌های وب فاکتور
                        </h2>

                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            پلن مناسب کسب‌وکار خود را انتخاب کنید و از امکانات
                            حرفه‌ای صدور و مدیریت فاکتور بهره‌مند شوید.
                        </p>
                    </div>

                    <PlansList />

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            برای اطلاعات بیشتر با ما تماس بگیرید.
                        </p>
                    </div>
                </div>
            </section>

            <SalesWorkflow />
            <CTA />
            <Footer />
        </main>
    );
}
