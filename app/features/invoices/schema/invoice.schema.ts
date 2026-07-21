import { z } from "zod";

// InvoiceItem schema
const InvoiceItemSchema = z.object({
    product_id: z
        .number()
        .int()
        .positive({ message: "محصول معتبر انتخاب شود" }),

    quantity: z
        .number()
        .min(1, "تعداد باید حداقل 1 باشد")
        .max(9223372036854776000, "تعداد بسیار زیاد است"),

    price: z.number().nonnegative("قیمت نمی‌تواند منفی باشد"),
});

// Main Invoice schema
export const InvoiceSchema = z.object({
    items: z.array(InvoiceItemSchema).nonempty("حداقل یک آیتم الزامی است"),

    id: z.number().int().positive().optional(),

    customer_name: z
        .string()
        .min(2, "نام مشتری باید حداقل 2 کاراکتر باشد")
        .max(255, "نام مشتری نمی‌تواند بیشتر از 255 کاراکتر باشد"),

    customer_phone_number: z.string(),
    customer_email: z.string(),
    customer_address: z.string(),
    descriptions: z
        .string()
        .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
        .optional(),
    title: z
        .string()
        .max(500, "عنوان نباید بیشتر از ۵۰۰ کاراکتر باشد")
        .min(2,"عنوان نباید کمتر از 2 کاراکتر باشد"),
    status: z.enum(["pending", "paid", "cancelled"]),
    payment_mode: z.enum(["cash", "card", "bank", "others"]),

    added_value: z.number().min(0, "ارزش اضافه نمی‌تواند منفی باشد"),
    discount: z.number().min(0, "تخفیف نمی‌تواند منفی باشد"),
});

export type InvoiceFormType = z.infer<typeof InvoiceSchema>;
