import {
    Barcode,
    Boxes,
    ChartNoAxesCombined,
    Check,
    FileText,
    Palette,
    Send,
    Users,
} from "lucide-react";
import { motion } from "motion/react";

const containerAnimation = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const cardAnimation = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export function Features() {
    return (
        <section id="features" className="relative overflow-hidden py-24">
            <div className="absolute inset-0 -z-10 bg-muted/20" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* عنوان */}
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <div className="inline-flex items-center rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm">
                        امکانات وب فاکتور
                    </div>

                    <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                        همه‌چیز برای مدیریت حرفه‌ای فروش
                    </h2>

                    <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
                        ابزارهای موردنیاز برای ساخت فاکتور، مدیریت کالا، مشتری و
                        گزارش‌های فروش در یک فضای یکپارچه.
                    </p>
                </div>

                <motion.div
                    variants={containerAnimation}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12"
                >
                    {/* ساخت و ارسال فاکتور */}
                    <motion.article
                        variants={cardAnimation}
                        className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 lg:col-span-7 lg:p-8"
                    >
                        <div className="absolute left-0 top-0 size-60 rounded-full bg-primary/10 blur-3xl" />

                        <div className="relative">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <FileText className="size-6" />
                            </div>

                            <h3 className="mt-5 text-2xl font-bold">
                                ساخت و ارسال فاکتور
                            </h3>

                            <p className="mt-2 max-w-xl leading-7 text-muted-foreground">
                                فاکتور حرفه‌ای بسازید و لینک اختصاصی آن را همان
                                لحظه برای مشتری ارسال کنید.
                            </p>

                            {/* نمونه فاکتور */}
                            <div className="mt-8 rounded-2xl border bg-background/80 p-4 shadow-lg backdrop-blur">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p className="font-bold">فاکتور فروش</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            شماره ۱۴۰۵-۰۰۱۲
                                        </p>
                                    </div>

                                    <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
                                        پرداخت‌شده
                                    </div>
                                </div>

                                <div className="space-y-3 py-4 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            طراحی رابط کاربری
                                        </span>
                                        <span className="font-semibold">
                                            ۸,۵۰۰,۰۰۰ تومان
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            خدمات پشتیبانی
                                        </span>
                                        <span className="font-semibold">
                                            ۱,۵۰۰,۰۰۰ تومان
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-4">
                                    <span className="font-bold">
                                        مبلغ نهایی
                                    </span>

                                    <span className="text-lg font-black text-primary">
                                        ۱۰,۰۰۰,۰۰۰ تومان
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                                <Send className="size-4" />
                                ارسال سریع با لینک اختصاصی
                            </div>
                        </div>
                    </motion.article>

                    {/* مدیریت موجودی */}
                    <motion.article
                        variants={cardAnimation}
                        className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:col-span-5 lg:p-8"
                    >
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Boxes className="size-6" />
                        </div>

                        <h3 className="mt-5 text-2xl font-bold">
                            مدیریت هوشمند موجودی
                        </h3>

                        <p className="mt-2 leading-7 text-muted-foreground">
                            موجودی کالاها و خریدها را دقیق و به‌ترتیب FIFO
                            مدیریت کنید.
                        </p>

                        <div className="mt-8 space-y-3">
                            {[
                                {
                                    name: "هدفون بی‌سیم",
                                    count: 24,
                                    color: "bg-green-500",
                                },
                                {
                                    name: "کیبورد مکانیکی",
                                    count: 8,
                                    color: "bg-amber-500",
                                },
                                {
                                    name: "مانیتور ۲۴ اینچ",
                                    count: 3,
                                    color: "bg-red-500",
                                },
                            ].map((product) => (
                                <div
                                    key={product.name}
                                    className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`size-2.5 rounded-full ${product.color}`}
                                        />

                                        <span className="text-sm font-medium">
                                            {product.name}
                                        </span>
                                    </div>

                                    <span className="text-sm font-bold">
                                        {product.count.toLocaleString("fa-IR")}{" "}
                                        عدد
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.article>

                    {/* Customer management */}
                    <motion.article
                        variants={cardAnimation}
                        className="group overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:col-span-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Users className="size-5" />
                            </div>

                            <span className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                                پرونده مشتریان
                            </span>
                        </div>

                        <h3 className="mt-5 text-xl font-bold">
                            مدیریت مشتریان
                        </h3>

                        <p className="mt-2 leading-7 text-muted-foreground">
                            اطلاعات تماس و سابقه فاکتورهای هر مشتری را یکجا
                            مشاهده کنید.
                        </p>

                        <div className="mt-6 overflow-hidden rounded-2xl border bg-background">
                            {[
                                {
                                    initial: "ع",
                                    name: "علی احمدی",
                                    invoices: "۳ فاکتور",
                                    status: "فعال",
                                },
                                {
                                    initial: "س",
                                    name: "سارا محمدی",
                                    invoices: "۵ فاکتور",
                                    status: "فعال",
                                },
                                {
                                    initial: "م",
                                    name: "محمد رضایی",
                                    invoices: "۲ فاکتور",
                                    status: "جدید",
                                },
                            ].map((customer, index) => (
                                <div
                                    key={customer.name}
                                    className={`flex items-center justify-between px-4 py-3 ${
                                        index !== 2 ? "border-b" : ""
                                    }`}
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                                            {customer.initial}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {customer.name}
                                            </p>

                                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                <FileText className="size-3" />
                                                {customer.invoices}
                                            </div>
                                        </div>
                                    </div>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                            customer.status === "جدید"
                                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                : "bg-green-500/10 text-green-600 dark:text-green-400"
                                        }`}
                                    >
                                        {customer.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                            <span>دسترسی سریع به سابقه خرید</span>

                            <span className="font-medium text-primary">
                                مشاهده پرونده
                            </span>
                        </div>
                    </motion.article>

                    {/* branding */}
                    <motion.article
                        variants={cardAnimation}
                        className="group rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:col-span-4"
                    >
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Palette className="size-5" />
                        </div>

                        <h3 className="mt-5 text-xl font-bold">
                            برندینگ اختصاصی
                        </h3>

                        <p className="mt-2 leading-7 text-muted-foreground">
                            رنگ، لوگو و اطلاعات فروشگاه خود را روی فاکتور نمایش
                            دهید.
                        </p>

                        <div className="mt-6 flex gap-3">
                            {[
                                "bg-[#2a8e9e]",
                                "bg-[#023347]",
                                "bg-[#8b5cf6]",
                                "bg-[#e879f9]",
                            ].map((color, index) => (
                                <div
                                    key={color}
                                    className={`flex size-10 items-center justify-center rounded-full ${color}`}
                                >
                                    {index === 0 && (
                                        <Check className="size-4 text-white" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.article>

                    {/* reports */}
                    <motion.article
                        variants={cardAnimation}
                        className="group rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:col-span-4"
                    >
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <ChartNoAxesCombined className="size-5" />
                        </div>

                        <h3 className="mt-5 text-xl font-bold">
                            گزارش‌های مالی
                        </h3>

                        <p className="mt-2 leading-7 text-muted-foreground">
                            روند فروش و عملکرد کسب‌وکار خود را بهتر تحلیل کنید.
                        </p>

                        <div className="mt-6 flex h-20 items-end gap-2">
                            {[35, 55, 42, 75, 60, 92, 78].map(
                                (height, index) => (
                                    <div
                                        key={`${height}-${index}`}
                                        className="flex-1 rounded-t-md bg-primary/20 transition group-hover:bg-primary/40"
                                        style={{
                                            height: `${height}%`,
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    </motion.article>

                    {/* barcode */}
                    <motion.article
                        variants={cardAnimation}
                        className="group relative overflow-hidden rounded-3xl border bg-gradient-to-l from-accent to-primary p-6 text-white shadow-xl md:col-span-2 lg:col-span-12 lg:p-8"
                    >
                        <div className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                                    <Barcode className="size-6" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold">
                                        صدور سریع فاکتور با بارکد
                                    </h3>

                                    <p className="mt-2 max-w-2xl leading-7 text-white/75">
                                        کالاها را با بارکدخوان سریع‌تر به فاکتور
                                        اضافه کنید و زمان ثبت فروش را کاهش دهید.
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium backdrop-blur">
                                سریع، دقیق و بدون ورود دستی
                            </div>
                        </div>
                    </motion.article>
                </motion.div>
            </div>
        </section>
    );
}
