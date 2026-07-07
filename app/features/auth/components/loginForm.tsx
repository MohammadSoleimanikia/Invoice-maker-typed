import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import type { Token } from "@/features/auth/types/token";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/features/shared/components/ui/field";
import { Input } from "@/features/shared/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/features/shared/components/ui/input-otp";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    otpFormSchema,
    type OtpFormType,
    phoneFormSchema,
    type PhoneFormType,
} from "@/schemas/auth.schema";
import useAuth from "@/store/auth";

const RESEND_COOLDOWN = 120;

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const logIn = useAuth((state) => state.logIn);

    const [step, setStep] = React.useState<"phone" | "otp">("phone");
    const [phone, setPhone] = React.useState("");
    const [resendTimer, setResendTimer] = React.useState(0);

    // تایمر resend
    React.useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => {
            setResendTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const phoneForm = useForm<PhoneFormType>({
        resolver: zodResolver(phoneFormSchema),
    });

    const otpForm = useForm<OtpFormType>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: { otp_code: "" },
    });

    // ارسال کد OTP
    async function requestOtp(phoneNumber: string) {
        await apiFetch("/account/request_otp/", {
            method: "POST",
            body: JSON.stringify({ phone_number: phoneNumber }),
        });
    }

    async function onSubmitPhone(data: PhoneFormType) {
        try {
            await requestOtp(data.phone_number);
            setPhone(data.phone_number);
            setStep("otp");
            setResendTimer(RESEND_COOLDOWN);
            otpForm.reset();
        } catch (error: any) {
            if (
                error?.phone_number?.[0] ===
                "OTP for this phone number is still valid."
            ) {
                toast.info("کد OTP هنوز معتبر است");
                setPhone(data.phone_number);
                setStep("otp");
                setResendTimer(RESEND_COOLDOWN);
                return;
            }
            const message = error?.detail ?? "مشکلی پیش آمده است.";
            phoneForm.setError("phone_number", { message });
        }
    }

    async function onSubmitOtp(data: OtpFormType) {
        try {
            const result = await apiFetch<Token>("/account/register/", {
                method: "POST",
                body: JSON.stringify({
                    phone_number: phone,
                    otp_code: data.otp_code,
                }),
            });
            logIn(result);
            navigate("/dashboard");
        } catch (error: any) {
            if (error?.otp_code === "OTP has expired.") {
                toast.error(
                    "کد تأیید منقضی شده است. لطفاً دوباره درخواست کنید.",
                );
                setStep("phone");
                otpForm.reset();
                return;
            }
            const message = error?.detail ?? "کد اشتباه است یا مشکلی پیش آمده";
            otpForm.setError("otp_code", { message });
        }
    }

    // auto-submit وقتی ۶ رقم کامل شد
    function handleOtpChange(value: string) {
        otpForm.setValue("otp_code", value, { shouldValidate: true });
        if (value.length === 6 && !otpForm.formState.isSubmitting) {
            otpForm.handleSubmit(onSubmitOtp)();
        }
    }

    async function handleResend() {
        if (resendTimer > 0) return;
        try {
            await requestOtp(phone);
            setResendTimer(RESEND_COOLDOWN);
            otpForm.reset();
            toast.success("کد جدید ارسال شد");
        } catch {
            toast.error("خطا در ارسال مجدد کد");
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 lg:grid-cols-2">
                    {step === "phone" ? (
                        <form
                            className="p-6 md:p-8"
                            onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
                        >
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">
                                        ورود به حساب
                                    </h1>
                                </div>

                                <Field>
                                    <label
                                        className="w-full"
                                        htmlFor="phone_number"
                                    >
                                        تلفن
                                    </label>
                                    <Input
                                        placeholder="09345677891"
                                        {...phoneForm.register("phone_number")}
                                        id="phone_number"
                                        type="number"
                                    />
                                    {phoneForm.formState.errors
                                        .phone_number && (
                                        <span className="text-red-500 text-sm">
                                            {
                                                phoneForm.formState.errors
                                                    .phone_number.message
                                            }
                                        </span>
                                    )}
                                </Field>

                                <Field>
                                    <Button
                                        disabled={
                                            phoneForm.formState.isSubmitting
                                        }
                                        type="submit"
                                        className="w-full"
                                    >
                                        {phoneForm.formState.isSubmitting
                                            ? "در حال ارسال..."
                                            : "دریافت کد"}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    ) : (
                        <form
                            className="p-6 md:p-8"
                            onSubmit={otpForm.handleSubmit(onSubmitOtp)}
                        >
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">
                                        تأیید شماره
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        کدی به {phone} ارسال شد
                                    </p>
                                </div>

                                <Field>
                                    <FieldLabel>کد تأیید</FieldLabel>
                                    <div className="flex justify-center">
                                        <InputOTP
                                            maxLength={6}
                                            value={otpForm.watch("otp_code")}
                                            onChange={handleOtpChange}
                                            disabled={
                                                otpForm.formState.isSubmitting
                                            }
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={5} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={0} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    {otpForm.formState.errors.otp_code && (
                                        <span className="text-red-500 text-sm block text-center mt-2">
                                            {
                                                otpForm.formState.errors
                                                    .otp_code.message
                                            }
                                        </span>
                                    )}
                                </Field>

                                <Field className="flex flex-col gap-2">
                                    <Button
                                        disabled={
                                            otpForm.formState.isSubmitting
                                        }
                                        type="submit"
                                        className="w-full"
                                    >
                                        {otpForm.formState.isSubmitting
                                            ? "در حال بررسی..."
                                            : "تأیید و ورود"}
                                    </Button>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => {
                                                setStep("phone");
                                                otpForm.reset();
                                            }}
                                        >
                                            اصلاح شماره
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            disabled={resendTimer > 0}
                                            onClick={handleResend}
                                        >
                                            {resendTimer > 0
                                                ? `ارسال مجدد (${resendTimer})`
                                                : "ارسال مجدد کد"}
                                        </Button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </form>
                    )}

                    <div className="relative hidden bg-muted dark:bg-muted-foreground  lg:flex justify-center items-center">
                        <img
                            src="/logo.svg"
                            alt="Image"
                            className=" inset-0 w-1/3  object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
