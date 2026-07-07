import { z } from "zod";


export const phoneFormSchema = z.object({
  phone_number: z
    .string()
    .min(1, "شماره تلفن الزامی است")
    .regex(/^09[0-9]{9}$/, "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"),
});


export const otpFormSchema = z.object({
  otp_code: z
    .string()
    .min(1, "کد تأیید الزامی است")
    .length(6, "کد تأیید باید 6 رقم باشد")
    .regex(/^[0-9]{6}$/, "کد تأیید فقط می‌تواند شامل اعداد باشد"),
});


export type PhoneFormType = z.infer<typeof phoneFormSchema>;
export type OtpFormType = z.infer<typeof otpFormSchema>;