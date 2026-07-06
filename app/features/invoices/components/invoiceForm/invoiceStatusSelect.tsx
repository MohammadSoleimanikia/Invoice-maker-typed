import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/features/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/features/shared/components/ui/select";

import type { InvoiceFormType } from "../../schema/invoice.schema";
export default function InvoiceStatusSelect() {
    const {
        control,
        formState: { errors },
    } = useFormContext<InvoiceFormType>();
    return (
        <div className="space-y-3 ">
            <Label htmlFor="status">وضعیت پرداخت</Label>
            <Controller
                control={control}
                name="status"
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className=" text-right px-3 py-2 border rounded-md">
                            <SelectValue placeholder="وضعیت پرداخت" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">در انتظار</SelectItem>
                            <SelectItem value="paid">پرداخت شده</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.status && (
                <span className="text-red-500">{errors.status.message}</span>
            )}
        </div>
    );
}
