// app/features/purchase-invoices/components/purchaseInvoiceForm/PurchaseDatePicker.tsx
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/features/shared/components/ui/button";
import { Calendar } from "@/features/shared/components/ui/calendar";
import { Label } from "@/features/shared/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import { cn } from "@/features/shared/lib/utils";

import type { PurchaseInvoiceFormType } from "../../schema/purchaseInvoice.schema";

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
    if (!date) return "تاریخ خرید را انتخاب کنید";

    return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

type PurchaseDatePickerProps = {
    name?: "purchased_time";
    label?: string;
    required?: boolean;
};

export default function PurchaseDatePicker({
    name = "purchased_time",
    label = "تاریخ خرید",
    required = true,
}: PurchaseDatePickerProps) {
    const [open, setOpen] = useState(false);

    const { control } = useFormContext<PurchaseInvoiceFormType>();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => {
                const selectedDate = parseDateInputValue(field.value);

                return (
                    <div className="space-y-2">
                        <Label>
                            {label}{" "}
                            {required && (
                                <span className="text-red-500">*</span>
                            )}
                        </Label>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-right font-normal",
                                        !selectedDate &&
                                            "text-muted-foreground",
                                    )}
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

                        {error && (
                            <span className="text-red-500 text-sm">
                                {error.message}
                            </span>
                        )}
                    </div>
                );
            }}
        />
    );
}
