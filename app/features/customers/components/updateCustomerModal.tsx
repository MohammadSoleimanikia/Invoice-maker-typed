// features/customers/components/updateCustomerModal.tsx
import {  SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";
import type { Customer, CustomerUpdate } from "../types/customer";

interface UpdateCustomerModalProps {
    customer: Customer;
    trigger?: React.ReactNode;
}

export default function UpdateCustomerModal({
    customer,
    trigger,
}: UpdateCustomerModalProps) {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        formState: { errors },
    } = useForm<CustomerUpdate>({
        defaultValues: {
            name: customer.name,
            email: customer.email || "",
            address: customer.address || "",
        },
    });

    const { mutateAsync: updateCustomer, isPending } = useUpdateCustomer();

    // پر کردن فرم با داده‌های مشتری هنگام باز شدن
    useEffect(() => {
        if (open && customer) {
            setValue("name", customer.name);
            setValue("email", customer.email || "");
            setValue("address", customer.address || "");
        }
    }, [open, customer, setValue]);

    const onSubmit = async (data: CustomerUpdate) => {
        try {
            await updateCustomer({
                id: String(customer.id), // تبدیل به string
                data,
            });
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
                {trigger || (
                    <Button variant="outline" >
                        <SquarePen className="w-4 h-4"/>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="font-vazir max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>ویرایش مشتری</DialogTitle>
                    <DialogDescription>
                        اطلاعات مشتری {customer.name} را ویرایش کنید
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
                        {isPending ? <LoadingSpinner /> : "ویرایش مشتری"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
