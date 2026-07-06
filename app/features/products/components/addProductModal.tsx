// features/products/components/AddProductModal.tsx
import num2persian from "num2persian";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import { useCategories } from "@/features/categories/hooks/useCategories";
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct";
import type { ProductCreate } from "@/features/products/types/product";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/features/shared/components/ui/select";

import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Label } from "../../shared/components/ui/label";
import { Textarea } from "../../shared/components/ui/textarea";
interface AddProductModalProps {
    disabled?: boolean;
}

export default function AddProductModal({
    disabled = false,
}: AddProductModalProps) {
    const { data: categoriesData } = useCategories({ pageSize: 100 });
    const [pricePersian, setPricePersian] = useState("");
    const [buyPersian, setBuyPersian] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ProductCreate>({
        defaultValues: {
            price: 0,
            last_buy_price: 0,
            stock_quantity: 0,
        },
    });

    const { createProduct, isCreating } = useCreateProduct();

    const onSubmit = async (data: ProductCreate) => {
        try {
            await createProduct(data);
            reset();
            setPricePersian("");
            setBuyPersian("");
        } catch (err: any) {
            console.error(err);
            if (err?.message?.length) {
                setError("root", {
                    type: "custom",
                    message: "نام کالا نباید تکراری باشد",
                });
            } else {
                setError("root", {
                    type: "custom",
                    message: "خطای ناشناخته‌ای رخ داد",
                });
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={disabled}>افزودن کالا</Button>
            </DialogTrigger>
            <DialogContent className="font-vazir max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>افزودن کالا</DialogTitle>
                    <DialogDescription>
                        جهت افزودن کالای جدید فرم زیر را تکمیل کنید
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* product name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                            نام کالا <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="مثال: گوشی سامسونگ A54"
                            className={errors.name ? "border-red-500" : ""}
                            {...register("name", {
                                required: "نام کالا الزامی است",
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
                        {errors.name && (
                            <p className="text-red-500 text-xs font-medium">
                                ⚠️ {errors.name.message}
                            </p>
                        )}
                    </div>
                    {/* category */}

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="category_id"
                            className="text-sm font-medium"
                        >
                            دسته‌بندی (اختیاری)
                        </Label>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value?.toString() || "none"} 
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value === "none"
                                                ? null
                                                : Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="انتخاب دسته‌بندی..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            بدون دسته‌بندی
                                        </SelectItem>{" "}
                                        {/* ✅ به جای "" از "none" */}
                                        {categoriesData?.results?.map(
                                            (category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {/* stock quantity */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="stock_quantity"
                            className="text-sm font-medium"
                        >
                            موجودی <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="stock_quantity"
                            type="number"
                            min={0}
                            step="any"
                            placeholder="مثال: ۱۰۰"
                            className={
                                errors.stock_quantity ? "border-red-500" : ""
                            }
                            {...register("stock_quantity", {
                                required: "موجودی الزامی است",
                                min: {
                                    value: 0,
                                    message: "موجودی نمی‌تواند منفی باشد",
                                },
                            })}
                        />
                        {errors.stock_quantity && (
                            <p className="text-red-500 text-xs font-medium">
                                ⚠️ {errors.stock_quantity.message}
                            </p>
                        )}
                    </div>

                    {/* description */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            توضیحات
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="توضیحات کالا (اختیاری)"
                            className={
                                errors.description ? "border-red-500" : ""
                            }
                            {...register("description", {
                                minLength: {
                                    value: 2,
                                    message: "حداقل ۲ کاراکتر",
                                },
                                maxLength: {
                                    value: 300,
                                    message: "حداکثر ۳۰۰ کاراکتر",
                                },
                            })}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs font-medium">
                                ⚠️ {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* قیمت فروش */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="price"
                                className="text-sm font-medium"
                            >
                                قیمت فروش{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                name="price"
                                control={control}
                                rules={{
                                    required: "قیمت الزامی است",
                                    min: { value: 1, message: "حداقل ۱" },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <NumericFormat
                                            id="price"
                                            value={field.value}
                                            thousandSeparator=","
                                            decimalSeparator="."
                                            placeholder="مثال: 15,500,000"
                                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                                error
                                                    ? "border-red-500"
                                                    : "border-input"
                                            }`}
                                            onValueChange={(values) => {
                                                const rawValue =
                                                    values.floatValue || 0;
                                                field.onChange(rawValue);
                                                setPricePersian(
                                                    num2persian(
                                                        String(rawValue),
                                                    ),
                                                );
                                            }}
                                        />
                                        {pricePersian && (
                                            <p className="text-green-600 text-xs font-medium">
                                                ✓ {pricePersian} تومان
                                            </p>
                                        )}
                                        {error && (
                                            <p className="text-red-500 text-xs font-medium">
                                                ⚠️ {error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* buy*/}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="buy"
                                className="text-sm font-medium"
                            >
                                قیمت خرید{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                name="last_buy_price"
                                control={control}
                                rules={{
                                    required: "قیمت خرید الزامی است",
                                    min: { value: 0, message: "نمیتواند منفی باشد." },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <NumericFormat
                                            id="buy"
                                            value={field.value}
                                            thousandSeparator=","
                                            decimalSeparator="."
                                            placeholder="مثال: 12,000,000"
                                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                                error
                                                    ? "border-red-500"
                                                    : "border-input"
                                            }`}
                                            onValueChange={(values) => {
                                                const rawValue =
                                                    values.floatValue || 0;
                                                field.onChange(rawValue);
                                                setBuyPersian(
                                                    num2persian(
                                                        String(rawValue),
                                                    ),
                                                );
                                            }}
                                        />
                                        {buyPersian && (
                                            <p className="text-green-600 text-xs font-medium">
                                                ✓ {buyPersian} تومان
                                            </p>
                                        )}
                                        {error && (
                                            <p className="text-red-500 text-xs font-medium">
                                                ⚠️ {error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* barcode */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="barcode"
                            className="text-sm font-medium"
                        >
                            بارکد کالا
                        </Label>
                        <Input
                            id="barcode"
                            type="text"
                            placeholder="بارکد کالا (اختیاری)"
                            className={errors.barcode ? "border-red-500" : ""}
                            {...register("barcode", {
                                minLength: {
                                    value: 4,
                                    message: "بارکد نامعتبر است",
                                },
                                maxLength: {
                                    value: 64,
                                    message: "بارکد خیلی طولانی است",
                                },
                            })}
                        />
                        {errors.barcode && (
                            <p className="text-red-500 text-xs font-medium">
                                ⚠️ {errors.barcode.message}
                            </p>
                        )}
                    </div>

                    {errors.root && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm font-medium">
                                {errors.root.message}
                            </p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isCreating || isSubmitting}
                        className="w-full mt-2"
                    >
                        {isCreating || isSubmitting ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                در حال ارسال...
                            </>
                        ) : (
                            "افزودن کالا"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
