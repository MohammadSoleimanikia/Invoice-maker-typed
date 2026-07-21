// features/customers/components/addCustomerModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/features/shared/components/ui/dialog";

import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Label } from "../../shared/components/ui/label";
import LoadingSpinner from "../../shared/components/ui/loadingSpinner";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import type { CustomerCreate } from "../types/customer";

interface AddCustomerModalProps {
    disabled?: boolean;
}

export default function AddCustomerModal({
    disabled = false,
}: AddCustomerModalProps) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CustomerCreate>();

    const { mutateAsync: createCustomer, isPending } = useCreateCustomer();

    const onSubmit = async (data: CustomerCreate) => {
        try {
            await createCustomer(data);
            toast.success("مشتری با موفقیت افزوده شد");
            reset();
            setOpen(false);
        } catch (err: any) {
            console.log("BACKEND ERROR 👉", err);

            if (err?.message) {
                setError("root", {
                    type: "server",
                    message: err.message,
                });
            } else {
                setError("root", {
                    type: "server",
                    message: "خطایی رخ داد، لطفاً دوباره تلاش کنید",
                });
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>افزودن مشتری</Button>
            </DialogTrigger>
            <DialogContent className="font-vazir max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>افزودن مشتری</DialogTitle>
                    <DialogDescription>
                        جهت افزودن مشتری جدید فرم زیر را تکمیل کنید
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* نام مشتری */}
                    <div className="space-y-2">
                        <Label htmlFor="name">نام مشتری</Label>
                        <Input
                            type="text"
                            id="name"
                            placeholder="نام مشتری"
                            {...register("name", {
                                required: "نام مشتری الزامی است",
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
                            <p className="text-red-500 text-sm">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* شماره تلفن */}
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">شماره تلفن</Label>
                        <Input
                            type="tel"
                            id="phone_number"
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            {...register("phone_number", {
                                required: "شماره تلفن الزامی است",
                                pattern: {
                                    value: /^09[0-9]{9}$/,
                                    message: "شماره تلفن معتبر نیست",
                                },
                            })}
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-sm">
                                {errors.phone_number.message}
                            </p>
                        )}
                    </div>

                    {/* ایمیل (اختیاری) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">ایمیل (اختیاری)</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="example@gmail.com"
                            {...register("email", {
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "ایمیل معتبر نیست",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* آدرس (اختیاری) */}
                    <div className="space-y-2">
                        <Label htmlFor="address">آدرس (اختیاری)</Label>
                        <Input
                            type="text"
                            id="address"
                            placeholder="آدرس مشتری"
                            {...register("address", {})}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">
                                {errors.address.message}
                            </p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="text-red-500 text-sm text-center">
                            {errors.root.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <LoadingSpinner />
                        ) : (
                            "افزودن مشتری"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
