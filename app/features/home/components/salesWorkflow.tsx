import { CheckCircle2, FilePenLine, Link2, Send } from "lucide-react";
import { motion } from "motion/react";

const steps = [
    {
        number: "۰۱",
        title: "اطلاعات را وارد کنید",
        description:
            "مشتری و کالاها را انتخاب کنید و جزئیات فاکتور را ثبت کنید.",
        icon: FilePenLine,
        preview: "form",
    },
    {
        number: "۰۲",
        title: "فاکتور آماده می‌شود",
        description:
            "قالب مناسب را انتخاب کنید و فاکتور حرفه‌ای خود را تحویل بگیرید.",
        icon: CheckCircle2,
        preview: "invoice",
    },
    {
        number: "۰۳",
        title: "لینک را ارسال کنید",
        description: "لینک اختصاصی فاکتور را سریع و ساده برای مشتری بفرستید.",
        icon: Send,
        preview: "message",
    },
] as const;

export function SalesWorkflow() {
    return (
        <section className="relative overflow-hidden bg-muted/20 py-24">
            <div className="absolute right-1/2 top-0 -z-10 h-96 w-96 translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm">
                        <CheckCircle2 className="size-4" />
                        شروع سریع و ساده
                    </div>

                    <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                        از ثبت اطلاعات تا ارسال فاکتور
                    </h2>

                    <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
                        فقط در سه مرحله، فاکتور حرفه‌ای خود را بسازید و برای
                        مشتری ارسال کنید.
                    </p>
                </div>

                <div className="relative mt-16">
                    <div className="absolute right-[16.5%] top-12 hidden h-px w-[67%] bg-gradient-to-l from-transparent via-primary/40 to-transparent lg:block" />

                    <div className="grid grid-cols-1 gap-6 lg:auto-rows-fr lg:grid-cols-3">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.article
                                    key={step.number}
                                    initial={{
                                        opacity: 0,
                                        y: 30,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                        amount: 0.3,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.12,
                                    }}
                                    className="relative flex h-full flex-col"
                                >
                                    <div className="relative z-10 mx-auto flex size-24 items-center justify-center rounded-full border bg-background shadow-lg">
                                        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Icon className="size-7" />
                                        </div>

                                        <span className="absolute -left-1 -top-1 flex size-8 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground shadow-md">
                                            {step.number}
                                        </span>
                                    </div>

                                    <div className="mt-6 flex flex-1 flex-col overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <h3 className="text-center text-xl font-bold">
                                            {step.title}
                                        </h3>

                                        <p className="mt-3 min-h-14 text-center text-sm leading-7 text-muted-foreground">
                                            {step.description}
                                        </p>

                                        <div className="mt-6">
                                            {step.preview === "form" && (
                                                <FormPreview />
                                            )}

                                            {step.preview === "invoice" && (
                                                <InvoicePreview />
                                            )}

                                            {step.preview === "message" && (
                                                <MessagePreview />
                                            )}
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FormPreview() {
    return (
        <div className="rounded-2xl border bg-background p-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold">اطلاعات فاکتور</p>

                <FilePenLine className="size-4 text-primary" />
            </div>

            <div className="mt-4 space-y-3">
                <div>
                    <span className="text-[10px] text-muted-foreground">
                        نام مشتری
                    </span>

                    <div className="mt-1 flex h-9 items-center rounded-lg border bg-muted/30 px-3 text-xs">
                        علی احمدی
                    </div>
                </div>

                <div>
                    <span className="text-[10px] text-muted-foreground">
                        انتخاب کالا
                    </span>

                    <div className="mt-1 flex h-9 items-center justify-between rounded-lg border bg-muted/30 px-3 text-xs">
                        <span>محصول نمونه</span>
                        <span className="text-primary">۲ عدد</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InvoicePreview() {
    return (
        <div className="rounded-2xl border bg-background p-4">
            <div className="flex items-start justify-between border-b pb-3">
                <div>
                    <p className="text-xs font-bold">فاکتور فروش</p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                        شماره ۱۴۰۵-۰۰۱۲
                    </p>
                </div>

                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 font-black text-primary">
                    و
                </div>
            </div>

            <div className="space-y-2 py-4 text-xs">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">محصول نمونه</span>
                    <span>۲,۵۰۰,۰۰۰</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">خدمات تکمیلی</span>
                    <span>۱,۰۰۰,۰۰۰</span>
                </div>
            </div>

            <div className="flex justify-between border-t pt-3 text-xs font-bold">
                <span>مبلغ نهایی</span>
                <span className="text-primary">۳,۵۰۰,۰۰۰ تومان</span>
            </div>
        </div>
    );
}

function MessagePreview() {
    return (
        <div className="rounded-2xl border bg-background p-4">
            <div className="rounded-[18px_18px_4px_18px] bg-primary px-4 py-3 text-xs leading-6 text-primary-foreground shadow-md">
                فاکتور شما آماده شد؛ از لینک زیر می‌توانید آن را مشاهده کنید.
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Link2 className="size-4" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold">مشاهده فاکتور</p>

                    <p
                        dir="ltr"
                        className="mt-1 truncate text-[10px] text-muted-foreground"
                    >
                        webfactor.ir/invoice/12345
                    </p>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-green-600 dark:text-green-400">
                <CheckCircle2 className="size-3" />
                لینک با موفقیت ارسال شد
            </div>
        </div>
    );
}
