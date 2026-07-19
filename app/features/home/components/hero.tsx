import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Link, NavLink } from "react-router";

import { Button } from "@/features/shared/components/ui/button";

import { InvoiceChatPreview } from "./invoiceChatPreview";

const benefits = ["راه‌اندازی سریع", "قالب‌های حرفه‌ای", "ارسال لینک عمومی"];

export function Hero() {
    return (
        <section className="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-28">
            {/* bg */}
            <div className="absolute inset-0 -z-20 bg-background" />

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_32%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.12),transparent_35%)]" />

            <div
                className="absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
                    {/* text */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                        className="text-center lg:text-right"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
                            <Sparkles className="size-4" />
                            سامانه حرفه‌ای مدیریت فاکتور و فروش
                        </div>

                        <h1 className="mt-7 text-4xl font-black leading-[1.25] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            فاکتور حرفه‌ای بساز؛
                            <span className="mt-2 block bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                                فروش را منظم‌تر مدیریت کن
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg lg:mx-0">
                            از ساخت و ارسال فاکتور تا مدیریت مشتری، کالا، موجودی
                            و گزارش فروش؛ همه در یک فضای ساده، سریع و حرفه‌ای.
                        </p>

                        {/* CTA */}
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                            <NavLink to="/dashboard">
                                <Button
                                    size="lg"
                                    className="h-12 w-full gap-2 px-7 text-base shadow-lg shadow-primary/20 sm:w-auto"
                                >
                                    رایگان شروع کنید
                                    <ArrowLeft className="size-4" />
                                </Button>
                            </NavLink>

                            <Link to="/demo">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 w-full border-border/80 bg-background/70 px-7 text-base backdrop-blur sm:w-auto"
                                >
                                    نمونه فاکتور را ببینید
                                </Button>
                            </Link>
                        </div>

                        {/* benefits */}
                        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-muted-foreground lg:justify-start">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit}
                                    className="flex items-center gap-2"
                                >
                                    <CheckCircle2 className="size-4 text-primary" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* insure*/}
                        <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="size-4 text-primary" />
                            اطلاعات کسب‌وکار شما با امنیت نگهداری می‌شود
                        </div>
                    </motion.div>

                    {/* show product preview */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                            duration: 0.7,
                        delay: 0.15,
                        }}
                        className="relative"
                    >
                        <div className="absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl" />

                        <InvoiceChatPreview />

                        {/* Float card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute -bottom-5 right-2 hidden items-center gap-3 rounded-2xl border bg-background/90 px-4 py-3 shadow-xl backdrop-blur sm:flex lg:-right-6"
                        >
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <CheckCircle2 className="size-5" />
                            </div>

                            <div>
                                <p className="text-sm font-bold">
                                    ارسال سریع فاکتور
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    فقط با یک لینک اختصاصی
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
