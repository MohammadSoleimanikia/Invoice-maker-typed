// features/products/components/EditProductModal.tsx
import { PenIcon } from "lucide-react";
import num2persian from "num2persian";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import { useCategories } from "@/features/categories/hooks/useCategories";
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
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import type { Product, ProductCreate } from "../types/product";

interface EditProductModalProps {
    product: Product;
}

export default function EditProductModal({ product }: EditProductModalProps) {
    const [open, setOpen] = useState(false);
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
            name: product.name,
            description: product.description || "",
            price: product.price,
            last_buy_price: product.last_buy_price,
            stock_quantity: product.stock_quantity,
            barcode: product.barcode || "",
            category_id: product.category?.id || null,
        },
    });

    const { mutateAsync: updateProduct, isPending } = useUpdateProduct();
    const { data: categoriesData } = useCategories({ pageSize: 100 });

    useEffect(() => {
        setPricePersian(num2persian(String(product.price)));
        setBuyPersian(num2persian(String(product.last_buy_price)));
    }, [product]);

    useEffect(() => {
        reset({
            name: product.name,
            description: product.description || "",
            price: product.price,
            last_buy_price: product.last_buy_price,
            stock_quantity: product.stock_quantity,
            barcode: product.barcode || "",
            category_id: product.category?.id || null,
        });
        setPricePersian(num2persian(String(product.price)));
        setBuyPersian(num2persian(String(product.last_buy_price)));
    }, [product, reset]);

    const onSubmit = async (data: ProductCreate) => {
        // ✅ ProductCreate
        try {
            await updateProduct({ id: product.id, data });
            toast.success("کالا با موفقیت ویرایش شد");
            setOpen(false);
        } catch (err: any) {
            console.error(err);
            if (err?.message?.includes("تکراری")) {
                setError("root", {
                    type: "custom",
                    message: "نام کالا نباید تکراری باشد",
                });
            } else {
                setError("root", {
                    type: "custom",
                    message: err?.message || "خطای ناشناخته‌ای رخ داد",
                });
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <PenIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="font-vazir max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ویرایش کالا</DialogTitle>
                    <DialogDescription>
                        جهت ویرایش کالا فرم زیر را تکمیل کنید
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* نام کالا */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                            نام کالا <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            defaultValue={product.name}
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

                    {/* دسته‌بندی */}
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
                                    value={field.value?.toString() || ""}
                                    onValueChange={(value) =>
                                        field.onChange(
                                            value ? Number(value) : null,
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="انتخاب دسته‌بندی..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">
                                            بدون دسته‌بندی
                                        </SelectItem>
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
                        {errors.category_id && (
                            <p className="text-red-500 text-xs font-medium">
                                ⚠️ {errors.category_id.message}
                            </p>
                        )}
                    </div>

                    {/* موجودی */}
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
                            defaultValue={product.stock_quantity}
                            placeholder="مثال: ۱۰۰"
                            className={
                                errors.stock_quantity ? "border-red-500" : ""
                            }
                            {...register("stock_quantity", {
                                required: "موجودی الزامی است",
                                min: {
                                    value: 0,
                                    message: "حداقل موجودی صفر میباشد",
                                },
                            })}
                        />
                        {errors.stock_quantity && (
                            <p className="text-red-500 text-xs font-medium">
                                ⚠️ {errors.stock_quantity.message}
                            </p>
                        )}
                    </div>

                    {/* توضیحات */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            توضیحات
                        </Label>
                        <Textarea
                            id="description"
                            defaultValue={product.description || ""}
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

                    {/* قیمت فروش و قیمت خرید */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* قیمت فروش */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="price"
                                className="text-sm font-medium"
                            >
                                قیمت فروش{" "}
                            </Label>
                            <Controller
                                name="price"
                                control={control}

                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <NumericFormat
                                            id="price"
                                            value={field.value}
                                            thousandSeparator=","
                                            decimalSeparator="."
                                            decimalScale={2}
                                            allowNegative={false}
                                            placeholder="مثال: ۱۵,۵۰۰,۰۰۰"
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

                        {/* قیمت خرید */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="last_buy_price"
                                className="text-sm font-medium"
                            >
                                قیمت خرید{" "}
                                
                            </Label>
                            <Controller
                                name="last_buy_price"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <NumericFormat
                                            id="last_buy_price"
                                            value={field.value}
                                            thousandSeparator=","
                                            decimalSeparator="."
                                            decimalScale={2}
                                            allowNegative={false}
                                            placeholder="مثال: ۱۲,۵۰۰,۰۰۰"
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

                    {/* بارکد */}
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
                            defaultValue={product.barcode || ""}
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

                    {/* خطای عمومی */}
                    {errors.root && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm font-medium">
                                {errors.root.message}
                            </p>
                        </div>
                    )}

                    {/* دکمه ارسال */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            انصراف
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || isSubmitting}
                            className="flex-1"
                        >
                            {isPending || isSubmitting ? (
                                <>
                                    <span className="animate-spin mr-2">
                                        ⏳
                                    </span>
                                    در حال ارسال...
                                </>
                            ) : (
                                "ویرایش کالا"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
