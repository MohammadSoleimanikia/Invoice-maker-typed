// features/invoices/components/NewInvoiceForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { useCustomers } from "@/features/customers/hooks/useCustomers";
import {
    type InvoiceFormType,
    InvoiceSchema,
} from "@/features/invoices/schema/invoice.schema";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Button } from "@/features/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";

import LoadingSpinner from "../../shared/components/ui/loadingSpinner";
import { useCreateInvoice } from "../hooks/useCreateInvoice";
import CustomerComboBox from "./invoiceForm/customerComboBox";
import CustomerDetailsFields from "./invoiceForm/customerDetailsFields";
import InvoiceStatusSelect from "./invoiceForm/invoiceStatusSelect";
import ItemsTable from "./invoiceForm/itemsTable";
import InvoicePaymentMethodSelect from "./invoiceForm/paymentMethodSelect";
import ProductBarcodeInput from "./invoiceForm/productBarcodeInput";
import ProductMultiSelect from "./invoiceForm/productMultiSelect";
import VatAndDiscountSection from "./invoiceForm/vatAndDiscountSection";

export default function NewInvoiceForm() {
    // get profile to get payment description
    const { data: profile, isLoading: profileLoading } = useProfile();
    const paymentDescription = profile?.profile?.payment_description || "";

    const navigate = useNavigate();
    const [vatEnabled, setVatEnabled] = useState(false);

    const methods = useForm<InvoiceFormType>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            items: [],
            customer_name: "",
            customer_phone_number: "",
            customer_email: "",
            customer_address: "",
            status: "pending",
            payment_mode: "cash",
            descriptions: "",
            title: "فاکتور فروش",
            added_value: 0,
            discount: 0,
        },
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
    } = methods;

    // set value of descriptions field to paymentDescription if it's empty
    useEffect(() => {
        if (!paymentDescription) return;

        const currentDescription = getValues("descriptions");

        if (!currentDescription || currentDescription.trim() === "") {
            setValue("descriptions", paymentDescription, {
                shouldDirty: false,
            });
        }
    }, [paymentDescription, getValues, setValue]);
    const { mutateAsync: createInvoice, isPending } = useCreateInvoice();
    // make page size high cause we want to search into all of the products and customers
    const { products } = useProducts({ pageSize: 1000 });
    const { data, isLoading } = useCustomers({ pageSize: 1000 });
    const customers = data?.results;
    const watchedItems = watch("items");
    const addedValue = watch("added_value");

    // calculate VAT
    useEffect(() => {
        if (!vatEnabled) {
            setValue("added_value", 0);
            return;
        }

        const totalPrice = watchedItems.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 0;
            return sum + price * qty;
        }, 0);

        setValue("added_value", Math.floor(totalPrice * 0.1));
    }, [vatEnabled, watchedItems, setValue]);

    const handleProductAdd = (product: any) => {
        const existing = watchedItems.find((i) => i.product_id === product.id);
        if (existing) {
            toast("محصول قبلا اضافه شده", { icon: "⚠️" });
            return;
        }
        setValue("items", [
            ...watchedItems,
            { product_id: product.id, quantity: 1, price: product.price },
        ]);
        toast.success(`${product.name} اضافه شد`);
    };

    const onSubmit = async (data: InvoiceFormType) => {
        try {
            await createInvoice(data);
        } catch (error) {
            console.error("error:", error);
        }
    };

    if (isLoading || profileLoading) {
        return <LoadingSpinner />;
    }

    // اگر محصولی وجود نداشت، پیام مناسب با دکمه رفتن به صفحه محصولات
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Package className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                    کالایی برای ایجاد فاکتور ندارید
                </h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    لطفاً ابتدا محصولات خود را اضافه کنید، سپس فاکتور خود را ثبت
                    نمایید
                </p>
                <div className="flex gap-3">
                    <Link to="/products">
                        <Button variant="default">رفتن به صفحه کالاها</Button>
                    </Link>
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        بازگشت
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* بخش: اطلاعات فاکتور */}

                <Card>
                    <CardHeader>
                        <CardTitle>اطلاعات فاکتور</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="supplier_name">
                                عنوان فاکتور{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="مثال: فاکتور فروش فروردین"
                            />
                            {errors.title && (
                                <span className="text-red-500 text-sm">
                                    {errors.title.message}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* بخش: انتخاب کالاها */}
                <Card>
                    <CardHeader>
                        <CardTitle>انتخاب کالاها</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProductMultiSelect products={products} />
                            <ProductBarcodeInput
                                products={products}
                                onProductAdd={handleProductAdd}
                            />
                        </div>
                    </CardContent>
                </Card>
                {/* جدول کالاها */}
                {watchedItems.length > 0 && (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-1 rounded-full bg-primary" />
                                    <h2 className="text-lg font-semibold">
                                        کالاهای انتخاب شده
                                    </h2>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {watchedItems.length} کالا
                                </span>
                            </div>
                            <ItemsTable products={products} />
                        </div>
                    </>
                )}

                {/* بخش: اطلاعات مشتری */}
                <Card>
                    <CardHeader>
                        <CardTitle>اطلاعات مشتری</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <CustomerComboBox customers={customers} />
                            <CustomerDetailsFields />
                        </div>
                    </CardContent>
                </Card>

                {/* بخش: توضیحات */}
                <Card>
                    <CardHeader>
                        <CardTitle>توضیحات</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-4">
                            {!paymentDescription && (
                                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                                    توضیحات پرداخت پیش‌فرضی در پروفایل ثبت نشده
                                    است. اگر می‌خواهید این بخش به‌صورت خودکار در
                                    فاکتورها پر شود، از بخش <Link className="text-primary hover:underline" to="/profile">پروفایل</Link> آن را اضافه
                                    کنید.
                                </div>
                            )}

                            <div className="space-y-2">
                                <Textarea
                                    {...register("descriptions")}
                                    id="descriptions"
                                    placeholder="توضیحات اضافی برای فاکتور، شرایط پرداخت یا شماره کارت"
                                    rows={3}
                                />

                                {errors.descriptions && (
                                    <span className="text-red-500 text-sm">
                                        {errors.descriptions.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* بخش: وضعیت و روش پرداخت */}
                <Card>
                    <CardHeader>
                        <CardTitle>وضعیت و روش پرداخت</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InvoiceStatusSelect />
                                <InvoicePaymentMethodSelect />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* بخش: ارزش افزوده و تخفیف */}
                <Card>
                    <CardHeader>
                        <CardTitle>ارزش افزوده و تخفیف</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <VatAndDiscountSection
                                vatEnabled={vatEnabled}
                                onVatToggle={setVatEnabled}
                                addedValue={addedValue}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* دکمه ارسال */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        انصراف
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="min-w-32"
                    >
                        {isPending ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                در حال ساخت...
                            </>
                        ) : (
                            "ساخت فاکتور"
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
