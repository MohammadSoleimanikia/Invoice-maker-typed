import { z } from "zod";
export const UserSchema = z.object({
    last_name: z
        .string()
        .min(2, "نام باید حداقل ۲ کاراکتر باشد")
        .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),
        first_name: z
        .string()
        .min(2, "نام باید حداقل ۲ کاراکتر باشد")
        .max(50, "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد"),

    phone_number: z
        .string()
        .regex(
            /^09[0-9]{9}$/,
            "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"
        ),

    insta_link: z.string().min(3, "کوتاه است لینک").or(z.literal("")),

    store_name: z
        .string()
        .min(2, "نام فروشگاه باید حداقل ۲ کاراکتر باشد")
        .max(100, "نام فروشگاه خیلی طولانی است"),

    store_address: z
        .string()
        .min(5, "آدرس خیلی کوتاه است")
        .max(300, "آدرس خیلی طولانی است"),

    store_description: z
        .string()
        .min(5, "توضیحات فروشگاه خیلی کم است")
        .max(500, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"),
});
