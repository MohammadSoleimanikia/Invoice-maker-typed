import {  Check, LayoutTemplate, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/features/shared/lib/utils";

type TemplateId = "boutique" | "modern" | "minimal" | "classic";

type TemplateOption = {
    id: TemplateId;
    name: string;
    description: string;
    accent: string;
};

const templates: TemplateOption[] = [
    {
        id: "boutique",
        name: "بوتیک",
        description: "مناسب فروشگاه‌ها و برندهای خاص",
        accent: "#b7794b",
    },
    {
        id: "modern",
        name: "مدرن",
        description: "طراحی امروزی و قدرتمند",
        accent: "#2a8e9e",
    },
    {
        id: "minimal",
        name: "مینیمال",
        description: "ساده، خلوت و خوانا",
        accent: "#18181b",
    },
    {
        id: "classic",
        name: "کلاسیک",
        description: "رسمی و مناسب کسب‌وکارها",
        accent: "#334155",
    },
];

export function TemplateShowcase() {
    const [selectedTemplate, setSelectedTemplate] =
        useState<TemplateId>("boutique");

    const selected =
        templates.find((template) => template.id === selectedTemplate) ??
        templates[0];

    return (
        <section className="relative overflow-hidden py-24">
            <div className="absolute inset-0 -z-20 bg-background" />

            <div className="absolute left-0 top-1/2 -z-10 size-[500px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm">
                            <LayoutTemplate className="size-4" />
                            قالب‌های حرفه‌ای
                        </div>

                        <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                            فاکتوری هماهنگ با
                            <span className="mt-2 block text-primary">
                                هویت کسب‌وکار شما
                            </span>
                        </h2>

                        <p className="mt-5 leading-8 text-muted-foreground">
                            از میان قالب‌های حرفه‌ای، طراحی مناسب برند خود را
                            انتخاب کنید و رنگ و اطلاعات فروشگاه را روی فاکتور
                            نمایش دهید.
                        </p>

                        <div className="mt-8 space-y-3">
                            {templates.map((template) => {
                                const isSelected =
                                    selectedTemplate === template.id;

                                return (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedTemplate(template.id)
                                        }
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-2xl border p-4 text-right transition",
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "bg-card hover:border-primary/40 hover:bg-muted/30",
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="size-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        template.accent,
                                                }}
                                            />

                                            <div>
                                                <p className="font-bold">
                                                    {template.name}
                                                </p>

                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={cn(
                                                "flex size-7 items-center justify-center rounded-full transition",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "border text-transparent",
                                            )}
                                        >
                                            <Check className="size-4" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl" />

                        <div className="overflow-hidden rounded-[2rem] border bg-card p-3 shadow-2xl sm:p-5">
                            <div className="mb-4 flex items-center justify-between px-2">
                                <div className="flex gap-1.5">
                                    <span className="size-2.5 rounded-full bg-red-400" />
                                    <span className="size-2.5 rounded-full bg-amber-400" />
                                    <span className="size-2.5 rounded-full bg-green-400" />
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Sparkles className="size-3.5 text-primary" />
                                    پیش‌نمایش قالب {selected.name}
                                </div>
                            </div>

                            <motion.div
                                key={selectedTemplate}
                                initial={{
                                    opacity: 0,
                                    scale: 0.98,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                            >
                                <InvoiceTemplatePreview
                                    template={selectedTemplate}
                                    accent={selected.accent}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

type PreviewProps = {
    template: TemplateId;
    accent: string;
};

function InvoiceTemplatePreview({ template, accent }: PreviewProps) {
    const isBoutique = template === "boutique";
    const isModern = template === "modern";
    const isMinimal = template === "minimal";
    const isClassic = template === "classic";

    return (
        <div
            className={cn(
                "relative mx-auto min-h-[520px] w-full overflow-hidden rounded-2xl border p-6 text-right text-gray-900 sm:p-8",
                isBoutique && "bg-[#fffaf5]",
                isModern && "bg-[#f4f8f9]",
                isMinimal && "bg-white",
                isClassic && "bg-[#f8fafc]",
            )}
            style={{
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
            }}
        >
            {isModern && (
                <div
                    className="absolute right-0 top-0 h-full w-2"
                    style={{ backgroundColor: accent }}
                />
            )}

            <div
                className={cn(
                    "flex items-start justify-between pb-6",
                    isClassic && "border-b-2 border-gray-800",
                    isMinimal && "border-b border-gray-200",
                    isBoutique && "border-b border-[#ead8c8]",
                )}
            >
                <div>
                    <div
                        className={cn(
                            "flex size-12 items-center justify-center font-black",
                            isBoutique &&
                                "rounded-full bg-[#f0dfd0] text-[#8c5b36]",
                            isModern && "rounded-2xl text-white",
                            isMinimal && "rounded-lg border border-gray-300",
                            isClassic && "rounded-none bg-gray-900 text-white",
                        )}
                        style={
                            isModern ? { backgroundColor: accent } : undefined
                        }
                    >
                        و
                    </div>

                    <p className="mt-3 font-bold">فروشگاه نمونه</p>

                    <p className="mt-1 text-xs text-gray-500">
                        تهران، خیابان نمونه
                    </p>
                </div>

                <div className="text-left">
                    <p
                        className={cn(
                            "text-2xl font-black",
                            isBoutique && "text-[#8c5b36]",
                        )}
                        style={isModern ? { color: accent } : undefined}
                    >
                        فاکتور فروش
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                        شماره: ۱۴۰۵-۰۰۱۲
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        تاریخ: ۱۴۰۵/۰۴/۲۸
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-400">مشتری</p>

                    <p className="mt-1 text-sm font-bold">علی احمدی</p>
                </div>

                <div>
                    <p className="text-xs text-gray-400">شماره تماس</p>

                    <p dir="ltr" className="mt-1 text-right text-sm font-bold">
                        0912 000 0000
                    </p>
                </div>
            </div>

            <div
                className={cn(
                    "mt-7 overflow-hidden",
                    isBoutique && "rounded-xl border border-[#ead8c8]",
                    isModern && "rounded-xl border",
                    isMinimal && "border-y",
                    isClassic && "border-2 border-gray-800",
                )}
            >
                <div
                    className={cn(
                        "grid grid-cols-[1fr_70px_120px] px-4 py-3 text-xs font-bold",
                        isBoutique && "bg-[#f0dfd0] text-[#704525]",
                        isModern && "text-white",
                        isMinimal && "bg-gray-50",
                        isClassic && "bg-gray-900 text-white",
                    )}
                    style={isModern ? { backgroundColor: accent } : undefined}
                >
                    <span>شرح کالا</span>
                    <span className="text-center">تعداد</span>
                    <span className="text-left">مبلغ</span>
                </div>

                {[
                    {
                        name: "محصول اول",
                        quantity: "۲",
                        price: "۴,۵۰۰,۰۰۰",
                    },
                    {
                        name: "محصول دوم",
                        quantity: "۱",
                        price: "۲,۵۰۰,۰۰۰",
                    },
                    {
                        name: "خدمات تکمیلی",
                        quantity: "۱",
                        price: "۱,۰۰۰,۰۰۰",
                    },
                ].map((item, index) => (
                    <div
                        key={item.name}
                        className={cn(
                            "grid grid-cols-[1fr_70px_120px] px-4 py-3 text-xs",
                            index !== 2 && "border-b",
                        )}
                    >
                        <span>{item.name}</span>
                        <span className="text-center">{item.quantity}</span>
                        <span className="text-left">{item.price}</span>
                    </div>
                ))}
            </div>

            <div className="mt-7 flex justify-end">
                <div className="w-full max-w-[260px] space-y-3">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>جمع کالاها</span>
                        <span>۸,۰۰۰,۰۰۰ تومان</span>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                        <span>تخفیف</span>
                        <span>۵۰۰,۰۰۰ تومان</span>
                    </div>

                    <div
                        className={cn(
                            "flex justify-between border-t pt-3 font-black",
                            isBoutique && "border-[#ead8c8]",
                        )}
                        style={{
                            color: isModern || isBoutique ? accent : undefined,
                        }}
                    >
                        <span>مبلغ نهایی</span>
                        <span>۷,۵۰۰,۰۰۰ تومان</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
