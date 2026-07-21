// features/profile/components/EditProfileModal.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { User } from "@/features/auth/types/user.type";
import {
    DEFAULT_INVOICE_TEMPLATE,
    invoiceTemplateOptions,
    isInvoiceTemplate,
} from "@/features/invoices/types/template";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/features/shared/components/ui/dialog";

import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Label } from "../../shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../shared/components/ui/select";
import { Textarea } from "../../shared/components/ui/textarea";
import { useEditProfile } from "../hooks/useEditProfile";

interface EditProfileModalProps {
    profile: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProfileModal({
    profile,
    open,
    onOpenChange,
}: EditProfileModalProps) {
    const [logoFile, setLogoFile] = useState<File | null>(null);
    // ✅ state برای همگام‌سازی رنگ
    const [hexcolor, setHexcolor] = useState(
        profile.profile.hexcolor || "#3b82f6",
    );

    const { form, mutateAsync, isPending } = useEditProfile(profile, () => {
        onOpenChange(false);
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = form;

    useEffect(() => {
        reset({
            first_name: profile.first_name,
            last_name: profile.last_name,
            store_name: profile.profile.store_name,
            store_description: profile.profile.store_description,
            store_address: profile.profile.store_address,
            insta_link: profile.profile.insta_link,
            hexcolor: profile.profile.hexcolor,
            payment_description: profile.profile.payment_description,
            default_invoice_template:
                profile.profile.default_invoice_template ||
                DEFAULT_INVOICE_TEMPLATE,
        });
        setHexcolor(profile.profile.hexcolor || "#3b82f6");
        setLogoFile(null);
    }, [profile, reset]);

    // ✅ تابع همگام‌سازی رنگ
    const handleColorChange = (color: string) => {
        setHexcolor(color);
        setValue("hexcolor", color);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90dvh] w-[95vw] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>ویرایش پروفایل</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit((data) =>
                        mutateAsync({ data, logoFile }),
                    )}
                    className="space-y-5 grid grid-cols-2 gap-x-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="first_name">نام</Label>
                        <Input
                            type="text"
                            id="first_name"
                            placeholder="نام"
                            {...register("first_name", {
                                minLength: {
                                    value: 2,
                                    message: "حداقل ۲ کاراکتر",
                                },
                                maxLength: {
                                    value: 30,
                                    message: "حداکثر ۳۰ کاراکتر",
                                },
                            })}
                        />
                        <p className="text-red-500 text-sm">
                            {errors.first_name?.message}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="last_name">نام خانوادگی</Label>
                        <Input
                            type="text"
                            id="last_name"
                            placeholder="نام خانوادگی"
                            {...register("last_name", {
                                minLength: {
                                    value: 2,
                                    message: "حداقل ۲ کاراکتر",
                                },
                                maxLength: {
                                    value: 30,
                                    message: "حداکثر ۳۰ کاراکتر",
                                },
                            })}
                        />
                        <p className="text-red-500 text-sm">
                            {errors.last_name?.message}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="store_name">نام فروشگاه</Label>
                        <Input
                            type="text"
                            id="store_name"
                            placeholder="نام فروشگاه"
                            {...register("store_name", {
                                maxLength: {
                                    value: 50,
                                    message: "حداکثر ۵۰ کاراکتر",
                                },
                            })}
                        />
                        <p className="text-red-500 text-sm">
                            {errors.store_name?.message}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="default_invoice_template">
                            قالب پیش‌فرض فاکتور
                        </Label>
                        <Select
                            value={
                                form.watch("default_invoice_template") ||
                                DEFAULT_INVOICE_TEMPLATE
                            }
                            onValueChange={(value) => {
                                if (!isInvoiceTemplate(value)) return;

                                setValue("default_invoice_template", value, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                            }}
                        >
                            <SelectTrigger id="default_invoice_template">
                                <SelectValue placeholder="انتخاب قالب" />
                            </SelectTrigger>
                            <SelectContent>
                                {invoiceTemplateOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            فاکتورها و لینک عمومی به‌صورت پیش‌فرض با این قالب
                            نمایش داده می‌شوند.
                        </p>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="payment_description">
                            توضیحات پرداخت فاکتور
                        </Label>

                        <Textarea
                            id="payment_description"
                            placeholder="مثال: شماره کارت 6037 9973 5555 4444."
                            rows={4}
                            {...register("payment_description", {
                                maxLength: {
                                    value: 500,
                                    message:
                                        "توضیحات پرداخت نباید بیشتر از ۵۰۰ کاراکتر باشد",
                                },
                            })}
                        />

                        <p className="text-xs text-muted-foreground">
                            این متن به‌صورت پیش‌فرض در بخش توضیحات فاکتورهای
                            جدید قرار می‌گیرد.
                        </p>

                        {errors.payment_description && (
                            <p className="text-red-500 text-sm">
                                {errors.payment_description.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="store_description">
                            توضیحات فروشگاه
                        </Label>
                        <Textarea
                            id="store_description"
                            placeholder="توضیحات فروشگاه"
                            {...register("store_description")}
                        />
                        <p className="text-red-500 text-sm">
                            {errors.store_description?.message}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="store_address">آدرس فروشگاه</Label>
                        <Input
                            type="text"
                            id="store_address"
                            placeholder="آدرس فروشگاه"
                            {...register("store_address", {
                                maxLength: {
                                    value: 255,
                                    message: "حداکثر ۲۵۵ کاراکتر",
                                },
                            })}
                        />
                        <p className="text-red-500 text-sm">
                            {errors.store_address?.message}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="insta_link">لینک اینستاگرام</Label>
                        <Input
                            type="text"
                            id="insta_link"
                            placeholder="لینک اینستاگرام"
                            {...register("insta_link", {
                                maxLength: {
                                    value: 100,
                                    message: "حداکثر ۱۰۰ کاراکتر",
                                },
                            })}
                        />
                        <p className="text-red-500 text-sm">
                            {errors.insta_link?.message}
                        </p>
                    </div>

                    {/* ✅ رنگ برند - ساده با کالر پیکر */}
                    <div className="space-y-2">
                        <Label htmlFor="hexcolor">رنگ برند</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                id="hexcolor"
                                value={hexcolor}
                                onChange={(e) =>
                                    handleColorChange(e.target.value)
                                }
                                className="w-16 h-10 p-1 cursor-pointer"
                            />
                            <Input
                                type="text"
                                placeholder="#RRGGBB"
                                value={hexcolor}
                                onChange={(e) =>
                                    handleColorChange(e.target.value)
                                }
                                className="flex-1 font-mono"
                                dir="ltr"
                            />
                        </div>
                        <p className="text-red-500 text-sm">
                            {errors.hexcolor?.message}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logo">لوگو (حداکثر 250 کیلوبایت)</Label>
                        <Input
                            type="file"
                            id="logo"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                if (file.size > 250 * 1024) {
                                    toast.error(
                                        "حجم فایل نباید بیشتر از 250 کیلوبایت باشد",
                                    );
                                    e.target.value = "";
                                    setLogoFile(null);
                                    return;
                                }

                                setLogoFile(file);
                                toast.success("لوگو با موفقیت انتخاب شد");
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            فرمت‌های مجاز: PNG, JPEG, WEBP
                        </p>
                    </div>

                    {errors.root && (
                        <p className="text-red-500 text-sm col-span-2 text-center">
                            {errors.root.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full col-span-2"
                    >
                        {isPending ? "در حال ارسال..." : "ویرایش پروفایل"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
