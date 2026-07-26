import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/features/shared/components/ui/accordion";

const faqItems = [
    {
        id: "what-is-webfactor",
        question: "وب‌فاکتور چیست؟",
        answer: "وب‌فاکتور یک ابزار آنلاین برای ساخت و مدیریت فاکتور است. با استفاده از آن می‌توانید اطلاعات مشتریان و محصولات را ثبت کنید، فاکتور حرفه‌ای بسازید و آن را چاپ یا از طریق لینک برای مشتری ارسال کنید سپس گزارش های مربوط به کاربران و فروش را در داشبورد ببینید.",
    },
    {
        id: "demo-invoice",
        question: "آیا قبل از ثبت‌نام می‌توانم قالب فاکتور را امتحان کنم؟",
        answer: "بله. در بخش ساخت رایگان فاکتور می‌توانید یک فاکتور آزمایشی بسازید، ظاهر نهایی آن را مشاهده کنید و همان‌جا از فاکتور پرینت بگیرید. اطلاعات فاکتور آزمایشی ذخیره نمی‌شود و به API متصل نیست.",
    },

    {
        id: "print-invoice",
        question: "آیا امکان چاپ فاکتور وجود دارد؟",
        answer: "بله. فاکتورهای ساخته‌شده و فاکتور آزمایشی را می‌توانید در قالب مناسب  مشاهده و مستقیماً از طریق مرورگر چاپ کنید.",
    },
    {
        id: "share-invoice",
        question: "چگونه فاکتور را برای مشتری ارسال کنم؟",
        answer: "برای هر فاکتور می‌توانید یک لینک اختصاصی ایجاد کرده و آن را برای مشتری ارسال کنید تا مشتری بدون ورود به حساب کاربری، فاکتور خود را مشاهده کند.",
    },
    {
        id: "manage-products",
        question: "آیا می‌توانم محصولات و مشتریان را مدیریت کنم؟",
        answer: "بله. می‌توانید اطلاعات محصولات، خدمات و مشتریان را ثبت و مدیریت کنید تا هنگام ساخت فاکتورهای بعدی نیازی به واردکردن دوباره اطلاعات نداشته باشید.",
    },
    {
        id: "subscription-end",
        question: "آیا پس از پایان اشتراک، اطلاعات من حذف می‌شود؟",
        answer: "خیر. اطلاعات شما همیشه محفوظ می‌ماند و به آن‌ها دسترسی خواهید داشت. تنها برای ثبت اطلاعات جدید و استفاده از امکانات نرم‌افزار، نیاز به اشتراک فعال دارید.",
    },
    {
        id: "fifo-inventory-pricing",
        question: "منظور از FIFO در افزودن کالاها چیست؟",
        answer: "FIFO به معنی «اولین ورود، اولین خروج» است. هر بار که موجودی جدیدی با قیمت متفاوت به انبار اضافه می‌شود، تا زمانی که موجودی قبلی به پایان نرسیده باشد، قیمت همان موجودی قبلی در فاکتور استفاده می‌شود. پس از اتمام آن، قیمت موجودی جدید اعمال خواهد شد. البته هنگام ثبت فاکتور، کاربر می‌تواند قیمت کالا را به‌صورت دستی تغییر دهد.",
    },
    {
        id: "should-register-for-shared-invoice",
        question: "آیا مشتری برای مشاهده فاکتور باید ثبت‌نام کند؟",
        answer: "خیر. مشتری تنها با باز کردن لینک، می‌تواند فاکتور را مشاهده کند و نیازی به ایجاد حساب کاربری ندارد..",
    },
    {
        id: "min-knowledge-to-use",
        question: " آیا برای استفاده از وب‌فاکتور باید حسابدار باشم؟",
        answer: "خیر. محیط وب‌فاکتور به گونه‌ای طراحی شده که بدون دانش حسابداری نیز بتوانید به‌راحتی فروش، فاکتورها و موجودی کالا را مدیریت کنید.",
    },
    {
        id: "limit-of-products-and-customers",
        question: "آیا تعداد محصولات یا مشتریان محدود است؟",
        answer: "خیر. می‌توانید متناسب با نیاز کسب‌وکار خود محصولات، مشتریان و فاکتورهای موردنیاز را ثبت و مدیریت کنید.",
    },
];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
        },
    })),
};

export function HomeFaq() {
    return (
        <section
            dir="rtl"
            aria-labelledby="home-faq-title"
            className="bg-background py-16 sm:py-24"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
                }}
            />

            <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
                <header className="mb-10 text-center">
                    <p className="mb-2 text-sm font-medium text-primary">
                        سؤالات متداول
                    </p>

                    <h2
                        id="home-faq-title"
                        className="text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                        پاسخ پرسش‌های شما درباره وب‌فاکتور
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                        هرآنچه برای ساخت، مدیریت، نمایش و چاپ فاکتور آنلاین نیاز
                        دارید.
                    </p>
                </header>

                <Accordion
                    type="single"
                    collapsible
                    className="w-full rounded-2xl border bg-card px-5 shadow-sm sm:px-7"
                >
                    {faqItems.map((item) => (
                        <AccordionItem
                            key={item.id}
                            value={item.id}
                            id={`faq-${item.id}`}
                            className="scroll-mt-24"
                        >
                            <AccordionTrigger className="text-right text-base font-medium hover:no-underline">
                                {item.question}
                            </AccordionTrigger>

                            <AccordionContent className="text-right text-sm leading-7 text-muted-foreground sm:text-base">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
