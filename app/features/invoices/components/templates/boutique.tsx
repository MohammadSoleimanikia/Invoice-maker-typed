import { MapPinHouse, PhoneCall, Store } from "lucide-react";
import type { CSSProperties } from "react";

import type { User } from "@/features/auth/types/user.type";
import type { InvoiceViewModel } from "@/features/invoices/types/invoicePreview.type";
import { formatPhoneNumber } from "@/features/shared/lib/phoneUtils";
import { buildLogoUrl } from "@/features/shared/lib/utils";

import Instagram from "../../../shared/components/instagramIcon";

type ReceiptProps = {
    invoice: InvoiceViewModel;
    user: User | null;
};

type RGB = {
    r: number;
    g: number;
    b: number;
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

    const raw = hex.trim().replace("#", "");

    if (/^[0-9a-fA-F]{3}$/.test(raw)) {
        const expanded = raw
            .split("")
            .map((char) => char + char)
            .join("");

        return `#${expanded.toLowerCase()}`;
    }

    if (/^[0-9a-fA-F]{6}$/.test(raw)) {
        return `#${raw.toLowerCase()}`;
    }

    return "#b77aa5";
}

function hexToRgb(hex: string): RGB {
    const normalized = normalizeHexColor(hex).replace("#", "");

    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
    };
}

function rgbToHex({ r, g, b }: RGB) {
    const toHex = (value: number) => {
        return Math.round(Math.min(255, Math.max(0, value)))
            .toString(16)
            .padStart(2, "0");
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColors(colorA: string, colorB: string, amount: number) {
    const a = hexToRgb(colorA);
    const b = hexToRgb(colorB);

    return rgbToHex({
        r: a.r + (b.r - a.r) * amount,
        g: a.g + (b.g - a.g) * amount,
        b: a.b + (b.b - a.b) * amount,
    });
}

function darken(hex: string, amount: number) {
    return mixColors(hex, "#000000", amount);
}

function hexToRgba(hex: string, alpha: number) {
    const { r, g, b } = hexToRgb(hex);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getLuminance(hex: string) {
    const { r, g, b } = hexToRgb(hex);

    const toLinear = (value: number) => {
        const channel = value / 255;

        return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
    };

    const red = toLinear(r);
    const green = toLinear(g);
    const blue = toLinear(b);

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getReadableTextColor(background: string) {
    return getLuminance(background) > 0.52 ? "#3b2a22" : "#ffffff";
}

function createBoutiquePalette(hex?: string | null) {
    const brand = normalizeHexColor(hex);
    const brandText = getReadableTextColor(brand);
    const brandLuminance = getLuminance(brand);

    const brandReadable = brandLuminance > 0.52 ? darken(brand, 0.48) : brand;

    return {
        brand,
        brandText,
        brandTextSoft: hexToRgba(brandText, 0.78),
        brandTextMuted: hexToRgba(brandText, 0.64),
        brandTextFaint: hexToRgba(brandText, 0.15),

        brandReadable,
        brandSoft: hexToRgba(brand, 0.12),
        brandMid: hexToRgba(brand, 0.24),

        ink: "#3b2a22",
        muted: "#9b6f62",
        line: "#eadbd3",
        paper: "#fffaf5",
    };
}

export default function Boutique({ invoice, user }: ReceiptProps) {
    const store = user?.profile;
    const palette = createBoutiquePalette(store?.hexcolor);

    const logo = store?.logo ? buildLogoUrl(store.logo) : "";

    const subtotal = invoice.items.reduce((sum, item) => {
        return sum + Number(item.total || 0);
    }, 0);

    const style = {
        "--boutique-brand": palette.brand,
        "--boutique-brand-soft": palette.brandSoft,
        "--boutique-brand-mid": palette.brandMid,
        "--boutique-brand-readable": palette.brandReadable,

        "--boutique-brand-text": palette.brandText,
        "--boutique-brand-text-soft": palette.brandTextSoft,
        "--boutique-brand-text-muted": palette.brandTextMuted,
        "--boutique-brand-text-faint": palette.brandTextFaint,

        "--boutique-ink": palette.ink,
        "--boutique-muted": palette.muted,
        "--boutique-line": palette.line,
        "--boutique-paper": palette.paper,
    } as CSSProperties;

    return (
        <div
            style={style}
            className="invoice-print-page mx-auto h-[297mm] w-[210mm] shrink-0 overflow-hidden bg-[#f7efe8] p-2 text-[12px] text-[var(--boutique-ink)] print:bg-white print:p-0"
        >
            <div className="invoice-print-inner flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--boutique-line)] bg-[var(--boutique-paper)] shadow-xl print:rounded-none print:border-0 print:shadow-none">
                {/* Header */}
                <header className="relative overflow-hidden bg-[var(--boutique-brand)] px-8 py-5 text-[var(--boutique-brand-text)]">
                    <div
                        className="absolute inset-0 opacity-20 [background-size:16px_16px]"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, var(--boutique-brand-text) 1px, transparent 1px)",
                        }}
                    />

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
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--boutique-brand-text-faint)] shadow-md">
                                        <Store className="h-8 w-8" />
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h2 className="truncate text-xl font-black text-[var(--boutique-brand-text)]">
                                        {store?.store_name || "نام فروشگاه"}
                                    </h2>

                                    {store?.store_description && (
                                        <p className="mt-1 line-clamp-2 text-xs text-[var(--boutique-brand-text-soft)]">
                                            {store.store_description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-0.5 text-xs text-[var(--boutique-brand-text-soft)]">
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
                                    <p dir="ltr" className="line-clamp-1">
                                        {store.insta_link}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <h1 className="text-3xl font-black text-[var(--boutique-brand-text)]">
                                {invoice.title || "فاکتور فروش"}
                            </h1>

                            <p className="text-xs text-[var(--boutique-brand-text-soft)]">
                                شماره فاکتور: #{invoice.invoiceNumber || "-"}
                            </p>

                            <div className="inline-flex rounded-full bg-[var(--boutique-brand-text-faint)] px-4 py-1.5 text-xs font-bold text-[var(--boutique-brand-text)] backdrop-blur">
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
                        <span className="inline-flex rounded-full  px-3 py-1 text-[11px] font-bold ">
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
                            <tr className="border-b border-[var(--boutique-line)] bg-[var(--boutique-brand-soft)] text-[var(--boutique-brand-readable)]">
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
                                جمع کالا ها
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
                                <span className="text-xs font-black tracking-[0.18em] text-[var(--boutique-brand-readable)]">
                                    مجموع
                                </span>

                                <span className="text-2xl font-black text-[var(--boutique-brand-readable)]">
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
                <footer className="invoice-print-footer mt-auto flex shrink-0 items-center justify-between bg-[var(--boutique-brand-soft)] px-8 py-3 text-[11px] text-[var(--boutique-brand-readable)]">
                    <div className="flex min-w-0 items-center gap-2">
                        <Store className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                            {store?.store_name || "فروشگاه"}
                        </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-4">
                        {store?.insta_link && (
                            <span className="flex max-w-[150px] items-center gap-1 truncate">
                                <Instagram className="h-4 w-4 shrink-0 text-current" />
                                <span dir="ltr"  className="truncate ">
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
