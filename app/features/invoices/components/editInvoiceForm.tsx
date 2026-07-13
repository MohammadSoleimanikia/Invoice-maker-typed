import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { Link } from "react-router";

import { useCustomers } from "@/features/customers/hooks/useCustomers";
import {
    type InvoiceFormType,
    InvoiceSchema,
} from "@/features/invoices/schema/invoice.schema";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { Textarea } from "@/features/shared/components/ui/textarea";

import LoadingSpinner from "../../shared/components/ui/loadingSpinner";
import { useInvoice } from "../hooks/useInvoice";
import { useUpdateInvoice } from "../hooks/useUpdateInvoice";
import CustomerComboBox from "./invoiceForm/customerComboBox";
import CustomerDetailsFields from "./invoiceForm/customerDetailsFields";
import InvoiceStatusSelect from "./invoiceForm/invoiceStatusSelect";
import ItemsTable from "./invoiceForm/itemsTable";
import InvoicePaymentMethodSelect from "./invoiceForm/paymentMethodSelect";
import VatAndDiscountSection from "./invoiceForm/vatAndDiscountSection";

type EditInvoiceFormProps = {
    invoiceId: string;
};

export default function EditInvoiceForm({ invoiceId }: EditInvoiceFormProps) {
    // Fetch user profile to get payment description
    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const paymentDescription = profile?.profile?.payment_description || "";

    const [vatEnabled, setVatEnabled] = useState(false);

    const { invoice: invoiceData, isLoading: isInvoiceLoading } =
        useInvoice(invoiceId);

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
            title: "",
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
        reset,
    } = methods;

    const { mutateAsync: updateInvoice, isPending } = useUpdateInvoice(); // تغییر به updateInvoice
    const { products } = useProducts({ pageSize: 1000 });
    const { data: customersData, isLoading: isCustomersLoading } = useCustomers(
        { pageSize: 1000 },
    );
    const customers = customersData?.results;
    const watchedItems = watch("items");
    const addedValue = watch("added_value");

    // Populate form with existing invoice data when it is fetched
    useEffect(() => {
        if (invoiceData) {
            const formattedItems = invoiceData.items.map((item: any) => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.price,
            }));

            reset({
                title: invoiceData.title || "",
                items: formattedItems,
                customer_name: invoiceData.customer_name || "",
                customer_phone_number: invoiceData.customer_phone_number || "",
                customer_email: invoiceData.customer_email || "",
                customer_address: invoiceData.customer_address || "",
                status: invoiceData.status || "pending",
                payment_mode: invoiceData.payment_mode || "cash",
                descriptions:
                    invoiceData.descriptions || paymentDescription || "",
                discount: invoiceData.discount || 0,
                added_value: invoiceData.added_value || 0,
            });

            if (invoiceData.added_value && invoiceData.added_value > 0) {
                setVatEnabled(true);
            }
        }
    }, [invoiceData, paymentDescription, reset]);

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

        setValue("added_value", Math.floor(totalPrice * 0.1)); // 10%
    }, [vatEnabled, watchedItems, setValue]);

    const onSubmit = async (data: InvoiceFormType) => {
        try {
            await updateInvoice({
                id: invoiceId,
                data: data,
            });
        } catch (error) {
            console.error("error:", error);
        }
    };

    if (isInvoiceLoading || isCustomersLoading || isProfileLoading) {
        return <LoadingSpinner />;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* عنوان فاکتور */}
                <div className="space-y-3">
                    <Label htmlFor="title">عنوان فاکتور</Label>
                    <Input {...register("title")} id="title" />
                    {errors.title && (
                        <span className="text-red-500">
                            {errors.title.message}
                        </span>
                    )}
                </div>

                {/* جدول محصولات */}
                {watchedItems.length > 0 && (
                    <ItemsTable isEdit={true} products={products} />
                )}

                {/* اطلاعات مشتری */}
                <CustomerComboBox customers={customers} />
                <CustomerDetailsFields />

                <div className="space-y-3">
                    <Label htmlFor="descriptions">توضیحات</Label>

                    {!paymentDescription && (
                        <p className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                            توضیحات پرداخت پیش‌فرضی در پروفایل ثبت نشده است. اگر
                            می‌خواهید این بخش به‌صورت خودکار در فاکتورها پر شود،
                            از بخش{" "}
                            <Link
                                className="text-primary hover:underline"
                                to="/profile"
                            >
                                پروفایل
                            </Link>{" "}
                            آن را اضافه کنید.
                        </p>
                    )}

                    <Textarea
                        {...register("descriptions")}
                        id="descriptions"
                        rows={3}
                        placeholder="توضیحات فاکتور یا شرایط پرداخت"
                    />

                    {errors.descriptions && (
                        <span className="text-red-500">
                            {errors.descriptions.message}
                        </span>
                    )}
                </div>

                {/* وضعیت و روش پرداخت */}
                <div className="flex gap-5">
                    <InvoiceStatusSelect />
                    <InvoicePaymentMethodSelect />
                </div>

                {/* ارزش افزوده و تخفیف */}
                <VatAndDiscountSection
                    vatEnabled={vatEnabled}
                    onVatToggle={setVatEnabled}
                    addedValue={addedValue}
                />

                <Button type="submit" disabled={isPending}>
                    {isPending ? "در حال ویرایش..." : "ویرایش فاکتور"}
                </Button>
            </form>
        </FormProvider>
    );
}
