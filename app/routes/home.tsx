// app/routes/home.tsx

import { CTA } from "@/features/home/components/cta";
import { Features } from "@/features/home/components/features";
import { Footer } from "@/features/home/components/footer";
import { Header } from "@/features/home/components/header";
import { Hero } from "@/features/home/components/hero";
import { SalesWorkflow } from "@/features/home/components/salesWorkflow";
import { TemplateShowcase } from "@/features/home/components/templateShowcase";
import { PlansList } from "@/features/subscription/components/PlansList";

// Main Home Component
export function meta() {
    return [
        { title: "وب فاکتور | سامانه حرفه‌ای صدور فاکتور آنلاین" },
        {
            name: "description",
            content:
                "ساخت، مدیریت و ارسال فاکتور حرفه‌ای با وب فاکتور. مناسب فروشگاه‌ها، شرکت‌ها و کسب‌وکارهای آنلاین",
        },
        {
            name: "keywords",
            content: "فاکتور, ساخت فاکتور, مدیریت فروش, صدور فاکتور آنلاین",
        },
    ];
}

export default function Home() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">
            <Header />
            <Hero />
            <Features />
            <TemplateShowcase />
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            تعرفه‌های وب‌فاکتور
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            پلن مناسب کسب‌وکار خود را انتخاب کنید و از امکانات
                            حرفه‌ای لذت ببرید
                        </p>
                    </div>
                    <PlansList />
                    <div className="text-center mt-8">
                        <p className="text-sm text-muted-foreground">
                            برای اطلاعات بیشتر با ما تماس بگیرید
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
