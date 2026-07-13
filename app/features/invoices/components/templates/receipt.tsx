import { MapPinHouse, PhoneCall, Store } from "lucide-react";
import type { CSSProperties } from "react";

import type { User } from "@/features/auth/types/user.type";
import type { InvoiceViewModel } from "@/features/invoices/types/invoicePreview.type";
import { formatPhoneNumber } from "@/features/shared/lib/phoneUtils";
import { buildLogoUrl } from "@/features/shared/lib/utils";

type ReceiptProps = {
    invoice: InvoiceViewModel;
    user: User | null;
};

function toMoney(value?: number | null) {
    return Number(value ?? 0).toLocaleString("fa-IR");
}
function formatJalaliDateToYearFirst(value?: string | null) {
    if (!value) return "-";

    const datePart = value
        .split(" ")
        .find((part) => /^\d{2,4}-\d{2}-\d{2,4}$/.test(part));

    if (!datePart) return value;

    const [first, month, last] = datePart.split("-");

    if (first.length === 4) {
        return `${first}-${month}-${last}`;
    }

    return `${last}-${month}-${first}`;
}
function normalizeHexColor(hex?: string | null) {
    if (!hex) return "#b77aa5";
    return hex.startsWith("#") ? hex : `#${hex}`;
}

function hexToRgba(hex: string, alpha: number) {
    const normalized = normalizeHexColor(hex).replace("#", "");

    if (normalized.length !== 6) {
        return `rgba(183, 122, 165, ${alpha})`;
    }

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Receipt({ invoice, user }: ReceiptProps) {
    const store = user?.profile;
    const brandColor = normalizeHexColor(store?.hexcolor);
    const logo = store?.logo ? buildLogoUrl(store.logo) : "";

    const subtotal = invoice.items.reduce((sum, item) => {
        return sum + Number(item.total || 0);
    }, 0);

    const style = {
        "--boutique-brand": brandColor,
        "--boutique-brand-soft": hexToRgba(brandColor, 0.12),
        "--boutique-brand-mid": hexToRgba(brandColor, 0.24),
        "--boutique-ink": "#3b2a22",
        "--boutique-muted": "#9b6f62",
        "--boutique-line": "#eadbd3",
        "--boutique-paper": "#fffaf5",
    } as CSSProperties;

    return (
        <div
            style={style}
            className="mx-auto h-[297mm] w-[210mm] shrink-0 overflow-hidden bg-[#f7efe8] p-2 text-[12px] text-[var(--boutique-ink)] print:bg-white print:p-0"
        >
            <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--boutique-line)] bg-[var(--boutique-paper)] shadow-xl print:rounded-none print:border-0 print:shadow-none">
                {/* Header */}
                <header className="relative overflow-hidden bg-[var(--boutique-brand)] px-8 py-5 text-white">
                    <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,_white_1px,_transparent_1px)] [background-size:16px_16px]" />

                    <div className="relative z-10 grid grid-cols-2 gap-6">
                        <div className="space-y-2 text-right">
                            <div className="flex items-center justify-start gap-3">
                                {logo ? (
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/90 p-2 shadow-md">
                                        <img
                                            src={logo}
                                            alt="لوگو"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-md">
                                        <Store className="h-8 w-8" />
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h2 className="truncate text-xl font-black">
                                        {store?.store_name || "نام فروشگاه"}
                                    </h2>

                                    {store?.store_description && (
                                        <p className="mt-1 line-clamp-1 text-xs text-white/75">
                                            {store.store_description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-0.5 text-xs text-white/75">
                                {user?.phone_number && (
                                    <p>
                                        {formatPhoneNumber(user.phone_number)}
                                    </p>
                                )}

                                {store?.store_address && (
                                    <p className="line-clamp-1">
                                        {store.store_address}
                                    </p>
                                )}

                                {store?.insta_link && (
                                    <p className="line-clamp-1">
                                        {store.insta_link}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <h1 className="text-3xl font-black ">
                                {invoice.title || "فاکتور فروش"}
                            </h1>

                            <p className="text-xs text-white/75">
                                شماره فاکتور: #{invoice.invoiceNumber || "-"}
                            </p>

                            <div className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs text-white backdrop-blur">
                                ممنون از خرید شما
                            </div>
                        </div>
                    </div>
                </header>

                {/* Meta */}
                <section className="grid grid-cols-4 border-b border-[var(--boutique-line)] bg-white/60 px-8 py-4 text-xs">
                    <div>
                        <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-[var(--boutique-muted)]">
                            تاریخ
                        </p>
                        <p className="font-semibold">
                            {formatJalaliDateToYearFirst(invoice.createdAt)}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-[var(--boutique-muted)]">
                            مشتری
                        </p>
                        <p className="font-semibold">
                            {invoice.customer.name || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-[var(--boutique-muted)]">
                            وضعیت
                        </p>
                        <span className="inline-flex rounded-full bg-[var(--boutique-brand-soft)] px-3 py-1 text-[11px] font-bold text-[var(--boutique-brand)]">
                            {invoice.statusText}
                        </span>
                    </div>

                    <div>
                        <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-[var(--boutique-muted)]">
                            پرداخت
                        </p>
                        <p className="font-semibold">{invoice.paymentText}</p>
                    </div>
                </section>

                {/* Seller / Buyer */}
                <section className="grid grid-cols-2 gap-8 border-b border-[var(--boutique-line)] bg-white px-8 py-5">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--boutique-muted)]">
                            فروشنده
                        </p>

                        <h3 className="text-base font-black">
                            {store?.store_name || "نام فروشگاه"}
                        </h3>

                        {store?.store_address && (
                            <p className="line-clamp-2 text-xs leading-6 text-[var(--boutique-muted)]">
                                {store.store_address}
                            </p>
                        )}

                        {user?.phone_number && (
                            <p className="text-xs text-[var(--boutique-muted)]">
                                تلفن: {formatPhoneNumber(user.phone_number)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--boutique-muted)]">
                            خریدار
                        </p>

                        <h3 className="text-base font-black">
                            {invoice.customer.name || "-"}
                        </h3>

                        {invoice.customer.address && (
                            <p className="line-clamp-2 text-xs leading-6 text-[var(--boutique-muted)]">
                                {invoice.customer.address}
                            </p>
                        )}

                        {invoice.customer.phone && (
                            <p className="text-xs text-[var(--boutique-muted)]">
                                تلفن: {invoice.customer.phone}
                            </p>
                        )}

                        {invoice.customer.email && (
                            <p className="text-xs text-[var(--boutique-muted)]">
                                ایمیل: {invoice.customer.email}
                            </p>
                        )}
                    </div>
                </section>

                {/* Items */}
                <section>
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-[var(--boutique-line)] bg-[var(--boutique-brand-soft)] text-[var(--boutique-muted)]">
                                <th className="px-8 py-3 text-right text-[10px] font-black tracking-[0.18em]">
                                    کالا
                                </th>
                                <th className="px-3 py-3 text-center text-[10px] font-black tracking-[0.18em]">
                                    تعداد
                                </th>
                                <th className="px-3 py-3 text-center text-[10px] font-black tracking-[0.18em]">
                                    قیمت واحد
                                </th>
                                <th className="px-8 py-3 text-left text-[10px] font-black tracking-[0.18em]">
                                    قیمت کل
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr
                                    key={`${item.name}-${index}`}
                                    className="border-b border-[var(--boutique-line)] bg-white"
                                >
                                    <td className="px-8 py-3 text-right font-semibold">
                                        {item.name}
                                    </td>

                                    <td className="px-3 py-3 text-center text-[var(--boutique-muted)]">
                                        {Number(item.quantity).toLocaleString(
                                            "fa-IR",
                                        )}
                                    </td>

                                    <td className="px-3 py-3 text-center text-[var(--boutique-muted)]">
                                        {toMoney(item.unitPrice)} تومان
                                    </td>

                                    <td className="px-8 py-3 text-left font-black">
                                        {toMoney(item.total)} تومان
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Totals / Description */}
                <section className="grid grid-cols-2 gap-8 border-b border-[var(--boutique-line)] bg-[#fffaf5] px-8 py-5">
                    <div className="space-y-3">
                        {invoice.descriptions && (
                            <div>
                                <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[var(--boutique-muted)]">
                                    توضیحات
                                </p>

                                <p className="max-h-[95px] overflow-hidden whitespace-pre-line rounded-xl border border-[var(--boutique-line)] bg-white/70 p-3 text-xs leading-6 text-[var(--boutique-muted)]">
                                    {invoice.descriptions}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mr-auto w-full max-w-[310px] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[var(--boutique-muted)]">
                                جمع جزء
                            </span>
                            <span>{toMoney(subtotal)} تومان</span>
                        </div>

                        {invoice.discount > 0 && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--boutique-muted)]">
                                    تخفیف
                                </span>
                                <span>{toMoney(invoice.discount)} تومان</span>
                            </div>
                        )}

                        {invoice.added_value > 0 && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[var(--boutique-muted)]">
                                    ارزش افزوده
                                </span>
                                <span>
                                    {toMoney(invoice.added_value)} تومان
                                </span>
                            </div>
                        )}

                        <div className="my-3 flex items-center gap-4">
                            <div className="h-px flex-1 bg-[var(--boutique-line)]" />
                            <span className="text-[var(--boutique-muted)]">
                                ٭
                            </span>
                            <div className="h-px flex-1 bg-[var(--boutique-line)]" />
                        </div>

                        <div className="rounded-xl border border-[var(--boutique-brand-mid)] bg-[var(--boutique-brand-soft)] p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black tracking-[0.18em] text-[var(--boutique-brand)]">
                                    مجموع
                                </span>

                                <span className="text-2xl font-black text-[var(--boutique-brand)]">
                                    {toMoney(invoice.total)}
                                </span>
                            </div>

                            <p className="mt-2 text-[11px] text-[var(--boutique-muted)]">
                                {invoice.totalText} تومان
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-auto flex shrink-0 items-center justify-between bg-[var(--boutique-brand-soft)] px-8 py-3 text-[11px] text-[var(--boutique-muted)]">
                    <div className="flex min-w-0 items-center gap-2">
                        <Store className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                            {store?.store_name || "فروشگاه"}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-4">
                        {store?.insta_link && (
                            <span className="flex max-w-[150px] items-center gap-1 truncate">
                                <img
                                    src={"/instagram.svg"}
                                    className="w-7 h-7"
                                />
                                <span className="truncate">
                                    {store.insta_link}
                                </span>
                            </span>
                        )}

                        {user?.phone_number && (
                            <span className="flex items-center gap-1">
                                <PhoneCall className="h-4 w-4 shrink-0" />
                                {formatPhoneNumber(user.phone_number)}
                            </span>
                        )}

                        {store?.store_address && (
                            <span className="flex max-w-[220px] items-center gap-1 truncate">
                                <MapPinHouse className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {store.store_address}
                                </span>
                            </span>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}
