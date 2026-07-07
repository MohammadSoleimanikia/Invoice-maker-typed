import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
    calculateInvoiceTotal,
    generateInvoiceId,
    getDefaultInvoiceFormValues,
    isInvoiceFormValid,
    transformFormItemsToInvoiceItems,
} from "@/features/demoInvoice/lib/invoiceUtils";
import { useInvoiceStore } from "@/features/demoInvoice/store/demoInvoice";
import type { DemoInvoiceFormType } from "@/features/demoInvoice/types/demoInvoice";
import {
    invoiceStatusOptions,
    paymentModeOptions,
} from "@/features/invoices/constants/invoice";
import { Button } from "@/features/shared/components/ui/button";
import { Calendar } from "@/features/shared/components/ui/calendar";
import {
    FormActions,
    FormSection,
} from "@/features/shared/components/ui/form-fields";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import { SelectField } from "@/features/shared/components/ui/select-field";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";
import {
    BUTTON_LABELS,
    LABELS,
    MESSAGES,
    PLACEHOLDERS,
} from "@/features/shared/constants/i18n";

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

type DemoInvoiceDatePickerProps = {
    control: ReturnType<typeof useForm<DemoInvoiceFormType>>["control"];
};

function DemoInvoiceDatePicker({ control }: DemoInvoiceDatePickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            control={control}
            name="created"
            render={({ field }) => {
                const selectedDate = parseDateInputValue(field.value);

                return (
                    <div className="space-y-2">
                        <Label>{LABELS.CREATED_DATE}</Label>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={`w-full justify-start text-right font-normal ${
                                        !selectedDate
                                            ? "text-muted-foreground"
                                            : ""
                                    }`}
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
                    </div>
                );
            }}
        />
    );
}

/**
 * Demo invoice form component
 * Allows users to manually create invoices without a database
 */
export default function DemoInvoiceForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, control, handleSubmit } = useForm<DemoInvoiceFormType>({
        defaultValues: getDefaultInvoiceFormValues(),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    /**
     * Handle form submission
     */
    const onSubmit = (data: DemoInvoiceFormType) => {
        try {
            setIsSubmitting(true);

            if (!isInvoiceFormValid(data.items)) {
                toast.error(MESSAGES.ERROR.MIN_ONE_PRODUCT);
                setIsSubmitting(false);
                return;
            }

            const total_amount = calculateInvoiceTotal(data.items);
            const invoiceItems = transformFormItemsToInvoiceItems(data.items);

            useInvoiceStore.getState().setInvoice({
                id: generateInvoiceId(),
                invoice_number: data.invoice_number,
                created: data.created,
                customer_name: data.customer_name,
                customer_address: data.customer_address,
                descriptions: data.descriptions,
                customer_email: data.customer_email,
                customer_phone_number: data.customer_phone_number,
                status: data.status,
                payment_mode: data.payment_mode,
                items: invoiceItems,
                total_amount,
                added_value: data.added_value ?? 0,
                discount: data.discount ?? 0,
                updated: new Date().toISOString(),
            });

            toast.success(MESSAGES.SUCCESS.SAVED);
            navigate("/demo-invoice/preview");
        } catch (error) {
            console.error("Error saving invoice:", error);
            toast.error(MESSAGES.ERROR.SAVE_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handle add product to items
     */
    const handleAddProduct = () => {
        append({ product_name: "", quantity: 1, price: 0 });
    };

    /**
     * Handle remove product from items
     */
    const handleRemoveProduct = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-4 max-w-4xl"
        >
            {/* Invoice Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{LABELS.INVOICE_NUMBER}</Label>
                    <Input
                        {...register("invoice_number")}
                        placeholder={PLACEHOLDERS.INVOICE_NUMBER}
                    />
                </div>

                <DemoInvoiceDatePicker control={control} />
            </div>

            {/* Customer Information Section */}
            <FormSection title={LABELS.CUSTOMER_INFO}>
                <div className="space-y-2">
                    <Label>{LABELS.CUSTOMER_NAME}</Label>
                    <Input
                        {...register("customer_name")}
                        placeholder={PLACEHOLDERS.CUSTOMER_NAME}
                    />
                </div>

                <div className="space-y-2">
                    <Label>{LABELS.ADDRESS}</Label>
                    <Input
                        {...register("customer_address")}
                        placeholder={PLACEHOLDERS.ADDRESS}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{LABELS.EMAIL}</Label>
                        <Input
                            {...register("customer_email")}
                            type="email"
                            placeholder={PLACEHOLDERS.EMAIL}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{LABELS.PHONE}</Label>
                        <Input
                            {...register("customer_phone_number")}
                            placeholder={PLACEHOLDERS.PHONE}
                        />
                    </div>
                </div>
            </FormSection>

            {/* Items Section */}
            <FormSection title={LABELS.ITEMS}>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead>{LABELS.PRODUCT_NAME}</TableHead>
                                <TableHead>{LABELS.QUANTITY}</TableHead>
                                <TableHead>{LABELS.UNIT_PRICE}</TableHead>
                                <TableHead>{LABELS.ACTIONS}</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell>
                                        <Input
                                            {...register(
                                                `items.${index}.product_name` as const,
                                            )}
                                            placeholder={
                                                PLACEHOLDERS.PRODUCT_NAME
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Input
                                            type="number"
                                            {...register(
                                                `items.${index}.quantity` as const,
                                                { valueAsNumber: true },
                                            )}
                                            placeholder={PLACEHOLDERS.QUANTITY}
                                            min="1"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Input
                                            type="number"
                                            {...register(
                                                `items.${index}.price` as const,
                                                { valueAsNumber: true },
                                            )}
                                            placeholder={
                                                PLACEHOLDERS.UNIT_PRICE
                                            }
                                            min="0"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleRemoveProduct(index)
                                            }
                                            disabled={fields.length === 1}
                                        >
                                            {BUTTON_LABELS.DELETE}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddProduct}
                >
                    {BUTTON_LABELS.ADD_PRODUCT}
                </Button>
            </FormSection>

            {/* Payment Information Section */}
            <FormSection title="اطلاعات پرداخت" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                        control={control}
                        name="status"
                        label={LABELS.PAYMENT_STATUS}
                        options={invoiceStatusOptions}
                    />

                    <SelectField
                        control={control}
                        name="payment_mode"
                        label={LABELS.PAYMENT_METHOD}
                        options={paymentModeOptions}
                    />
                </div>
            </FormSection>

            {/* Form Actions */}
            <FormActions>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? BUTTON_LABELS.SAVING
                        : BUTTON_LABELS.SAVE_AND_PREVIEW}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                >
                    {BUTTON_LABELS.BACK_TO_HOME}
                </Button>
            </FormActions>
        </form>
    );
}
