import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link, NavLink } from "react-router";

import { Button } from "@/features/shared/components/ui/button";

import { InvoiceChatPreview } from "./invoiceChatPreview";
export function Hero() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    });
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    return (
        <motion.section
            ref={targetRef}
            style={{ opacity, scale }}
            className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e5e7eb_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#1f2937_100%)]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 text-center lg:text-right">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                                ✨ سامانه ابری مدیریت فاکتور
                            </span>
                            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-5xl xl:text-6xl">
                                <span className="text-primary">
                                    فاکتور حرفه‌ای
                                </span>{" "}
                                بساز و همون لحظه ارسال کن
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                همه چیز برای ساخت، ارسال و مدیریت فاکتور در چند
                                ثانیه آماده است. بدون دردسر، بدون پیچیدگی.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <NavLink to="/dashboard">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto gap-2"
                                    >
                                        شروع کنید
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14" />
                                            <path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </Button>
                                </NavLink>
                                <Link to="/demo">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        ساخت رایگان فاکتور
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                    <div className="lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl" />
                            <InvoiceChatPreview />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
