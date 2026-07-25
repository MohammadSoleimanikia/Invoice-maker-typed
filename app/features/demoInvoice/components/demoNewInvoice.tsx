import { CalendarIcon, Plus, Trash2, Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import {
    Controller,
    FormProvider,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
    calculateInvoiceTotal,
    calculateItemsSubtotal,
    generateInvoiceId,
    getDefaultInvoiceFormValues,
    isInvoiceFormValid,
    transformFormItemsToInvoiceItems,
} from "@/features/demoInvoice/lib/invoiceUtils";
import { useInvoiceStore } from "@/features/demoInvoice/store/demoInvoice";
import type { DemoInvoiceFormType } from "@/features/demoInvoice/types/demoInvoice";
import CustomerDetailsFields from "@/features/invoices/components/invoiceForm/customerDetailsFields";
import InvoiceStatusSelect from "@/features/invoices/components/invoiceForm/invoiceStatusSelect";
import InvoicePaymentMethodSelect from "@/features/invoices/components/invoiceForm/paymentMethodSelect";
import VatAndDiscountSection from "@/features/invoices/components/invoiceForm/vatAndDiscountSection";
import { Button } from "@/features/shared/components/ui/button";
import { Calendar } from "@/features/shared/components/ui/calendar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";
import { Textarea } from "@/features/shared/components/ui/textarea";

function formatDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function parseDateInputValue(value?: string | null) {
    if (!value) return undefined;

    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return undefined;

    return new Date(year, month - 1, day);
}

function formatPersianDisplayDate(date?: Date) {
    if (!date) return "تاریخ را انتخاب کنید";

    return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function DemoInvoiceDatePicker({
    control,
}: {
    control: ReturnType<typeof useForm<DemoInvoiceFormType>>["control"];
}) {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            control={control}
            name="created"
            rules={{ required: "تاریخ فاکتور الزامی است" }}
            render={({ field, fieldState }) => {
                const selectedDate = parseDateInputValue(field.value);

                return (
                    <div className="space-y-2">
                        <Label>تاریخ فاکتور</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start text-right font-normal"
                                >
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                    {formatPersianDisplayDate(selectedDate)}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    defaultMonth={selectedDate ?? new Date()}
                                    onSelect={(date) => {
                                        if (!date) return;
                                        field.onChange(
                                            formatDateInputValue(date),
                                        );
                                        setOpen(false);
                                    }}
                                    className="rounded-lg border"
                                />
                            </PopoverContent>
                        </Popover>
                        {fieldState.error && (
                            <p className="text-sm text-red-500">
                                {fieldState.error.message}
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
}

export default function DemoInvoiceForm() {
    const navigate = useNavigate();
    const [vatEnabled, setVatEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const savedFormData = useInvoiceStore((state) => state.formData);

    const methods = useForm<DemoInvoiceFormType>({
        defaultValues: savedFormData ?? getDefaultInvoiceFormValues(),
        mode: "onSubmit",
    });

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchedItems = watch("items");
    const addedValue = watch("added_value");
    const discount = watch("discount");
    const sellerLogo = watch("seller_logo");

    const subtotal = calculateItemsSubtotal(watchedItems);
    const payableTotal = calculateInvoiceTotal(
        watchedItems,
        addedValue,
        discount,
    );

    useEffect(() => {
        if (!vatEnabled) {
            setValue("added_value", 0);
            return;
        }

        setValue("added_value", Math.floor(subtotal * 0.1));
    }, [setValue, subtotal, vatEnabled]);

    const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("فایل لوگو باید تصویر باشد");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("حجم لوگو نباید بیشتر از ۲ مگابایت باشد");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setValue("seller_logo", reader.result, {
                    shouldDirty: true,
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = (data: DemoInvoiceFormType) => {
        if (!isInvoiceFormValid(data.items)) {
            toast.error("حداقل یک کالای معتبر وارد کنید");
            return;
        }

        if (data.customer_name.trim().length < 2) {
            setError("customer_name", {
                message: "نام مشتری باید حداقل ۲ کاراکتر باشد",
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const now = new Date().toISOString();
            const items = transformFormItemsToInvoiceItems(data.items);
            const totalAmount = calculateInvoiceTotal(
                data.items,
                data.added_value,
                data.discount,
            );

            const invoiceId = generateInvoiceId();

            useInvoiceStore.getState().setPreviewData({
                formData: data,
                invoice: {
                    id: invoiceId,
                    invoice_number: data.invoice_number.trim(),
                    title: data.title.trim(),
                    created: data.created,
                    updated: now,
                    public_token: invoiceId,
                    customer_name: data.customer_name.trim(),
                    customer_address: data.customer_address.trim(),
                    customer_email: data.customer_email.trim(),
                    customer_phone_number: data.customer_phone_number.trim(),
                    descriptions: data.descriptions.trim(),
                    status: data.status,
                    payment_mode: data.payment_mode,
                    items,
                    total_amount: totalAmount,
                    added_value: Number(data.added_value) || 0,
                    discount: Number(data.discount) || 0,
                },
                user: {
                    id: 0,
                    first_name: "",
                    last_name: "",
                    phone_number: data.seller_phone_number.trim(),
                    date_joined: now,
                    profile: {
                        store_name: data.seller_store_name.trim(),
                        store_description: data.seller_store_description.trim(),
                        store_address: data.seller_store_address.trim(),
                        insta_link: data.seller_insta_link.trim(),
                        hexcolor: data.seller_hexcolor || "#2a8e9e",
                        logo: data.seller_logo || "",
                        payment_description: data.descriptions.trim() || null,
                    },
                },
            });

            toast.success("فاکتور آماده پیش‌نمایش است");
            navigate("/demo-invoice/preview");
        } catch (error) {
            console.error("Error creating local invoice:", error);
            toast.error("ساخت فاکتور ناموفق بود");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>اطلاعات فروشگاه</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="seller_store_name">
                                    نام فروشگاه{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="seller_store_name"
                                    {...register("seller_store_name", {
                                        required: "نام فروشگاه الزامی است",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "حداقل ۲ کاراکتر وارد کنید",
                                        },
                                    })}
                                />
                                {errors.seller_store_name && (
                                    <p className="text-sm text-red-500">
                                        {errors.seller_store_name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seller_phone_number">
                                    تلفن فروشگاه
                                </Label>
                                <Input
                                    id="seller_phone_number"
                                    type="tel"
                                    {...register("seller_phone_number")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seller_store_address">
                                    آدرس فروشگاه
                                </Label>
                                <Input
                                    id="seller_store_address"
                                    {...register("seller_store_address")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seller_insta_link">
                                    اینستاگرام
                                </Label>
                                <Input
                                    className="text-left"
                                    id="seller_insta_link"
                                    placeholder="store_name"
                                    {...register("seller_insta_link")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seller_hexcolor">
                                    رنگ برند
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="seller_hexcolor"
                                        type="color"
                                        className="h-10 w-16 p-1"
                                        {...register("seller_hexcolor")}
                                    />
                                    <Input
                                        value={watch("seller_hexcolor")}
                                        onChange={(event) =>
                                            setValue(
                                                "seller_hexcolor",
                                                event.target.value,
                                            )
                                        }
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seller_logo">
                                    لوگوی فروشگاه
                                </Label>
                                <div className="flex items-center gap-3">
                                    <Label
                                        htmlFor="seller_logo"
                                        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border px-4"
                                    >
                                        <Upload className="h-4 w-4" />
                                        انتخاب لوگو
                                    </Label>
                                    <Input
                                        id="seller_logo"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                    {sellerLogo && (
                                        <div className="relative size-12">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setValue(
                                                        "seller_logo",
                                                        "",
                                                        { shouldDirty: true },
                                                    )
                                                }
                                                className="absolute -top-2 -right-2 z-10 flex size-5 items-center justify-center rounded-full bg-destructive text-white hover:bg-destructive/90"
                                                aria-label="حذف لوگو"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <line
                                                        x1="18"
                                                        y1="6"
                                                        x2="6"
                                                        y2="18"
                                                    />
                                                    <line
                                                        x1="6"
                                                        y1="6"
                                                        x2="18"
                                                        y2="18"
                                                    />
                                                </svg>
                                            </button>
                                            <img
                                                src={sellerLogo}
                                                alt="پیش‌نمایش لوگو"
                                                className="absolute top-0 left-0 rounded border object-contain size-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seller_store_description">
                                توضیح کوتاه فروشگاه
                            </Label>
                            <Textarea
                                id="seller_store_description"
                                rows={2}
                                {...register("seller_store_description")}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>اطلاعات فاکتور</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                عنوان فاکتور{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                {...register("title", {
                                    required: "عنوان فاکتور الزامی است",
                                    minLength: {
                                        value: 2,
                                        message: "حداقل ۲ کاراکتر وارد کنید",
                                    },
                                })}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="invoice_number">
                                شماره فاکتور{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="invoice_number"
                                {...register("invoice_number", {
                                    required: "شماره فاکتور الزامی است",
                                })}
                            />
                            {errors.invoice_number && (
                                <p className="text-sm text-red-500">
                                    {errors.invoice_number.message}
                                </p>
                            )}
                        </div>

                        <DemoInvoiceDatePicker control={control} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>کالاهای فاکتور</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                append({
                                    product_name: "",
                                    quantity: 1,
                                    price: 0,
                                })
                            }
                        >
                            <Plus className="ml-1 h-4 w-4" />
                            افزودن کالا
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted">
                                        <TableHead>نام کالا</TableHead>
                                        <TableHead>تعداد</TableHead>
                                        <TableHead>قیمت واحد (تومان)</TableHead>
                                        <TableHead className="w-16">
                                            عملیات
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="min-w-56">
                                                <Input
                                                    {...register(
                                                        `items.${index}.product_name`,
                                                        {
                                                            required:
                                                                "نام کالا الزامی است",
                                                        },
                                                    )}
                                                    placeholder="نام کالا"
                                                />
                                                {errors.items?.[index]
                                                    ?.product_name && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {
                                                            errors.items[index]
                                                                ?.product_name
                                                                ?.message
                                                        }
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="min-w-28">
                                                <Input
                                                    type="number"
                                                    inputMode="decimal"
                                                    step="0.001"
                                                    min="0.001"
                                                    {...register(
                                                        `items.${index}.quantity`,
                                                        {
                                                            valueAsNumber: true,
                                                            required:
                                                                "مقدار الزامی است",
                                                            min: {
                                                                value: 0.001,
                                                                message:
                                                                    "مقدار باید بیشتر از صفر باشد",
                                                            },
                                                            validate: (value) =>
                                                                Number.isFinite(
                                                                    value,
                                                                ) ||
                                                                "مقدار واردشده معتبر نیست",
                                                        },
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="min-w-44">
                                                <Controller
                                                    control={control}
                                                    name={`items.${index}.price`}
                                                    rules={{
                                                        min: {
                                                            value: 0,
                                                            message:
                                                                "قیمت منفی نیست",
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <NumericFormat
                                                            value={
                                                                field.value || 0
                                                            }
                                                            thousandSeparator=","
                                                            decimalSeparator="."
                                                            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                            onValueChange={(
                                                                values,
                                                            ) =>
                                                                field.onChange(
                                                                    values.floatValue ||
                                                                        0,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={
                                                        fields.length === 1
                                                    }
                                                    onClick={() =>
                                                        remove(index)
                                                    }
                                                    aria-label="حذف کالا"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex flex-wrap justify-end gap-5 rounded-lg bg-muted/40 p-4 text-sm">
                            <span>
                                جمع کالاها:{" "}
                                <strong>
                                    {subtotal.toLocaleString("fa-IR")}
                                </strong>
                            </span>
                            <span>
                                مبلغ قابل پرداخت:{" "}
                                <strong>
                                    {payableTotal.toLocaleString("fa-IR")}
                                </strong>{" "}
                                تومان
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>اطلاعات مشتری</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomerDetailsFields />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>توضیحات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            {...register("descriptions", {
                                maxLength: {
                                    value: 500,
                                    message:
                                        "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد",
                                },
                            })}
                            placeholder="توضیحات اضافی، شرایط پرداخت یا شماره کارت"
                            rows={3}
                        />
                        {errors.descriptions && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.descriptions.message}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>وضعیت و روش پرداخت</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InvoiceStatusSelect />
                        <InvoicePaymentMethodSelect />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>ارزش افزوده و تخفیف</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VatAndDiscountSection
                            vatEnabled={vatEnabled}
                            onVatToggle={setVatEnabled}
                            addedValue={addedValue}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/")}
                    >
                        انصراف
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-36"
                    >
                        {isSubmitting
                            ? "در حال آماده‌سازی..."
                            : "پیش‌نمایش و چاپ"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
