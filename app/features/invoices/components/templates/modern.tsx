import { Mail, MapPinHouse, Store } from "lucide-react";
import type { CSSProperties } from "react";

import type { User } from "@/features/auth/types/user.type";
import type { InvoiceViewModel } from "@/features/invoices/types/invoicePreview.type";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { buildLogoUrl, phoneFormatter } from "@/features/shared/lib/utils";

import Instagram from "../../../shared/components/instagramIcon";

type InvoiceProps = {
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

function formatDate(value?: string | null) {
    if (!value) return "-";

    const datePart = value
        .split(" ")
        .find((part) => /^\d{2,4}[-/]\d{2}[-/]\d{2,4}$/.test(part));

    if (!datePart) return value;

    const normalized = datePart.replaceAll("/", "-");
    const [first, month, last] = normalized.split("-");

    if (first.length === 4) {
        return `${first}/${month}/${last}`;
    }

    return `${last}/${month}/${first}`;
}

function normalizeHexColor(hex?: string | null) {
    if (!hex) return "#3659b3";

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

    return "#3659b3";
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

function lighten(hex: string, amount: number) {
    return mixColors(hex, "#ffffff", amount);
}

function rgba(hex: string, alpha: number) {
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
    return getLuminance(background) > 0.52 ? "#172033" : "#ffffff";
}

function createBrandPalette(hex?: string | null) {
    const brand = normalizeHexColor(hex);
    const luminance = getLuminance(brand);
    const text = getReadableTextColor(brand);

    const isLight = luminance > 0.52;
    const isVeryLight = luminance > 0.78;
    const isVeryDark = luminance < 0.12;

    const panel = brand; // دقیقاً رنگ برند؛ جای اصلی استفاده از رنگ کاربر
    const panelDark = isLight ? darken(brand, 0.22) : darken(brand, 0.14);
    const panelDarker = isLight ? darken(brand, 0.34) : darken(brand, 0.24);

    const bgTop = isVeryLight
        ? lighten(brand, 0.08)
        : isVeryDark
          ? lighten(brand, 0.2)
          : lighten(brand, 0.22);

    const bgMid = brand; // دقیقاً رنگ برند
    const bgBottom = isLight ? darken(brand, 0.28) : darken(brand, 0.34);

    const totalText = isVeryLight ? darken(brand, 0.55) : panelDarker;

    return {
        brand,
        bgTop,
        bgMid,
        bgBottom,
        panel,
        panelDark,
        panelDarker,
        text,
        textSoft: rgba(text, 0.82),
        textMuted: rgba(text, 0.68),
        textFaint: rgba(text, 0.1),
        border: rgba(text, 0.58),
        borderSoft: rgba(text, 0.25),
        panelSoft: rgba(text, 0.14),
        rowBorder: rgba(text, 0.16),
        dots: rgba(text, 0.26),
        dotsStrong: rgba(text, 0.42),
        totalBg: "#ffffff",
        totalText,
    };
}

export default function Modern({ invoice, user }: InvoiceProps) {
    const { data: profile } = useProfile();

    const displayUser = user || profile;
    const store = displayUser?.profile;

    const logo = store?.logo ? buildLogoUrl(store.logo) : "";

    const subtotal = invoice.items.reduce((sum, item) => {
        return sum + Number(item.total || 0);
    }, 0);

    const payableAmount =
        subtotal -
        Number(invoice.discount || 0) +
        Number(invoice.added_value || 0);

    const palette = createBrandPalette(store?.hexcolor);

    const style = {
        "--studio-bg-top": palette.bgTop,
        "--studio-bg-mid": palette.bgMid,
        "--studio-bg-bottom": palette.bgBottom,

        "--studio-panel": palette.panel,
        "--studio-panel-dark": palette.panelDark,
        "--studio-panel-darker": palette.panelDarker,
        "--studio-panel-soft": palette.panelSoft,

        "--studio-border": palette.border,
        "--studio-border-soft": palette.borderSoft,
        "--studio-row-border": palette.rowBorder,

        "--studio-text": palette.text,
        "--studio-text-soft": palette.textSoft,
        "--studio-text-muted": palette.textMuted,
        "--studio-text-faint": palette.textFaint,

        "--studio-total-bg": palette.totalBg,
        "--studio-total-text": palette.totalText,

        "--studio-dots": palette.dots,
        "--studio-dots-strong": palette.dotsStrong,
    } as CSSProperties;

    return (
        <div
            dir="rtl"
            style={style}
            className="invoice-print-page mx-auto h-[297mm] w-[210mm] shrink-0 overflow-hidden bg-[linear-gradient(180deg,var(--studio-bg-top)_0%,var(--studio-bg-mid)_43%,var(--studio-bg-bottom)_100%)] p-0 text-[12px] text-[var(--studio-text)] print:m-0"
        >
            <div className="invoice-print-inner relative flex h-full flex-col overflow-hidden px-8 py-7">
                {/* Decorative title ghost */}
                <div className="pointer-events-none absolute -top-10 left-8 text-[80px] font-black tracking-[0.05em] text-[var(--studio-text-faint)]">
                    {store?.store_name}
                </div>

                {/* Dots top right */}
                <div className="pointer-events-none absolute right-[128mm] top-[34mm] h-[35mm] w-[74mm] opacity-70 [background-image:radial-gradient(circle,var(--studio-dots)_1.8px,transparent_2px)] [background-size:9px_9px]" />

                {/* Dots bottom left */}
                <div className="pointer-events-none absolute bottom-[70mm] left-2 h-[28mm] w-[70mm] opacity-70 [background-image:radial-gradient(circle,var(--studio-dots-strong)_1.8px,transparent_2px)] [background-size:9px_9px]" />

                {/* XOX decorations */}
                <div className="pointer-events-none absolute bottom-[82mm] right-2 flex items-center gap-3 text-[54px] font-black leading-none text-[var(--studio-text-soft)]">
                    <span>×</span>
                    <span className="font-light">○</span>
                    <span>×</span>
                </div>

                {/* Top brand bar */}
                <header className="relative z-10 mb-7 flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-3 rounded-full border border-[var(--studio-border-soft)] bg-[var(--studio-panel-soft)] px-4 py-2 shadow-sm backdrop-blur">
                        {logo ? (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white p-1.5">
                                <img
                                    src={logo}
                                    alt="لوگو"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--studio-border)]">
                                <Store className="h-5 w-5" />
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-base font-bold uppercase tracking-[0.2em] text-[var(--studio-text-soft)]">
                                {store?.store_name || "نام فروشگاه"}
                            </p>

                            <p className="truncate text-xs text-[var(--studio-text-muted)]">
                                {store?.store_description || "توضیحات فروشگاه"}
                            </p>

                            {displayUser?.phone_number && (
                                <p className="truncate text-xs text-[var(--studio-text-muted)]">
                                    {phoneFormatter(displayUser.phone_number)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex max-w-[135mm] items-center gap-2 rounded-full bg-[var(--studio-panel)] px-5 py-2 text-[10px] text-[var(--studio-text)] shadow-md">
                        {displayUser?.profile.insta_link && (
                            <div className="flex items-center gap-1.5">
                                <Instagram className="h-3.5 w-3.5 shrink-0 text-current" />
                                <span className="truncate">
                                    {displayUser.profile.insta_link}
                                </span>
                            </div>
                        )}

                        {invoice.customer.email && (
                            <div className="flex items-center gap-1.5 truncate">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate" dir="ltr">
                                    {invoice.customer.email}
                                </span>
                            </div>
                        )}

                        {store?.store_address && (
                            <div className="flex items-center gap-1.5 truncate">
                                <MapPinHouse className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">
                                    {store.store_address}
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Big title */}
                <section className="relative z-10 mb-7 flex items-end justify-between">
                    <div>
                        <h1
                            dir="ltr"
                            className="text-[54px] font-black leading-none tracking-[0.06em] text-[var(--studio-text)]"
                        >
                            {invoice.title || "فاکتور فروش"}
                        </h1>
                    </div>

                    <div className="rounded-full border border-[var(--studio-border)] px-5 py-2 text-xs font-bold text-[var(--studio-text-soft)]">
                        {invoice.statusText}
                    </div>
                </section>

                {/* Main content */}
                <main className="relative z-10 grid flex-1 grid-cols-[58mm_1fr] gap-7 overflow-hidden">
                    {/* Sidebar */}
                    <aside className="space-y-3">
                        <section className="rounded-xl border border-[var(--studio-border)] bg-[var(--studio-panel-soft)] p-4 text-xs shadow-sm backdrop-blur">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] font-bold text-[var(--studio-text-muted)]">
                                        شماره فاکتور
                                    </p>
                                    <p className="mt-1 font-bold">
                                        #{invoice.invoiceNumber || "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-[var(--studio-text-muted)]">
                                        تاریخ صدور
                                    </p>
                                    <p className="mt-1 font-bold">
                                        {formatDate(invoice.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-[var(--studio-text-muted)]">
                                        روش پرداخت
                                    </p>
                                    <p className="mt-1 font-bold">
                                        {invoice.paymentText || "-"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl bg-[var(--studio-panel)] p-5 text-[var(--studio-text)] shadow-lg">
                            <p className="text-[12px] font-black text-[var(--studio-text-soft)]">
                                فاکتور برای
                            </p>

                            <h2 className="mt-3 text-xl font-black leading-7">
                                {invoice.customer.name || "-"}
                            </h2>

                            <div className="mt-4 space-y-1.5 text-right text-[11px] leading-5 text-[var(--studio-text-soft)]">
                                {invoice.customer.phone && (
                                    <p>{invoice.customer.phone}</p>
                                )}

                                {invoice.customer.email && (
                                    <p className="break-all" dir="ltr">
                                        {invoice.customer.email}
                                    </p>
                                )}

                                {invoice.customer.address && (
                                    <p className="line-clamp-3">
                                        {invoice.customer.address}
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-xl bg-[var(--studio-panel)] p-5 text-[var(--studio-text)] shadow-lg">
                            <p className="text-[12px] font-black text-[var(--studio-text-soft)]">
                                اطلاعات پرداخت
                            </p>

                            <div className="mt-3 space-y-2 text-[11px] leading-5 text-[var(--studio-text-soft)]">
                                <p>
                                    <span className="font-bold text-[var(--studio-text)]">
                                        روش:
                                    </span>{" "}
                                    {invoice.paymentText || "-"}
                                </p>

                                {invoice.descriptions && (
                                    <p className="line-clamp-6 whitespace-pre-line">
                                        {invoice.descriptions}
                                    </p>
                                )}
                            </div>
                        </section>
                    </aside>

                    {/* Table and totals */}
                    <section className="flex min-w-0 flex-col overflow-hidden">
                        <div className="overflow-hidden rounded-2xl border border-[var(--studio-border)] bg-[var(--studio-panel-soft)] shadow-sm backdrop-blur">
                            <table className="w-full border-collapse text-[11px]">
                                <thead>
                                    <tr className="bg-[var(--studio-panel)] text-[var(--studio-text)]">
                                        <th className="w-[14%] px-3 py-3 text-center font-black">
                                            تعداد
                                        </th>
                                        <th className="px-3 py-3 text-right font-black">
                                            شرح کالا
                                        </th>
                                        <th className="w-[22%] px-3 py-3 text-center font-black">
                                            قیمت واحد
                                        </th>
                                        <th className="w-[22%] px-3 py-3 text-left font-black">
                                            قیمت کل
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {invoice.items.map((item, index) => (
                                        <tr
                                            key={`${item.name}-${index}`}
                                            className="border-b border-[var(--studio-row-border)] last:border-b-0"
                                        >
                                            <td className="px-3 py-3 text-center font-bold text-[var(--studio-text-soft)]">
                                                {Number(
                                                    item.quantity,
                                                ).toLocaleString("fa-IR")}
                                            </td>

                                            <td className="px-3 py-3 text-right font-bold text-[var(--studio-text)]">
                                                {item.name}
                                            </td>

                                            <td className="px-3 py-3 text-center text-[var(--studio-text-soft)]">
                                                {toMoney(item.unitPrice)}
                                            </td>

                                            <td className="px-3 py-3 text-left font-bold text-[var(--studio-text)]">
                                                {toMoney(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5 mr-auto w-full max-w-[98mm] space-y-2 text-sm">
                            <div className="flex items-center justify-between px-4">
                                <span className="font-bold text-[var(--studio-text-soft)]">
                                    جمع کالاها:
                                </span>
                                <span className="font-bold">
                                    {toMoney(subtotal)} تومان
                                </span>
                            </div>

                            {invoice.discount > 0 && (
                                <div className="flex items-center justify-between px-4">
                                    <span className="font-bold text-[var(--studio-text-soft)]">
                                        تخفیف:
                                    </span>
                                    <span className="font-bold">
                                        {toMoney(invoice.discount)} تومان
                                    </span>
                                </div>
                            )}

                            {invoice.added_value > 0 && (
                                <div className="flex items-center justify-between px-4">
                                    <span className="font-bold text-[var(--studio-text-soft)]">
                                        ارزش افزوده:
                                    </span>
                                    <span className="font-bold">
                                        {toMoney(invoice.added_value)} تومان
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between rounded-full bg-[var(--studio-total-bg)] px-4 py-3 text-[var(--studio-total-text)] shadow-md">
                                <span className="text-base font-black">
                                    مبلغ قابل پرداخت:
                                </span>
                                <span className="text-base font-black">
                                    {toMoney(payableAmount)} تومان
                                </span>
                            </div>

                            <p className="px-4 text-[10px] leading-5 text-[var(--studio-text-muted)]">
                                مبلغ به حروف: {invoice.totalText} تومان
                            </p>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-5">
                            <div className="max-w-[92mm]">
                                <p className="mb-2 text-sm font-black">
                                    شرایط و توضیحات
                                </p>

                                <p className="line-clamp-4 text-[10px] leading-5 text-[var(--studio-text-soft)]">
                                    {invoice.descriptions ||
                                        "این فاکتور به‌صورت الکترونیکی صادر شده است. لطفاً اطلاعات کالا، مبلغ و مشخصات پرداخت را پیش از تسویه بررسی کنید."}
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mb-2 font-[cursive] text-2xl text-[var(--studio-text-soft)]">
                                    {store?.store_name || "Signature"}
                                </div>

                                <p className="text-xs font-black">
                                    {[
                                        displayUser?.first_name,
                                        displayUser?.last_name,
                                    ]
                                        .filter(Boolean)
                                        .join(" ") || "مدیریت فروشگاه"}
                                </p>

                                <p className="mt-1 text-[10px] text-[var(--studio-text-muted)]">
                                    صادرکننده فاکتور
                                </p>

                                <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-[var(--studio-text)]" />
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="invoice-print-footer relative z-10 mt-5 shrink-0">
                    <div className="rounded-full border-4 border-white bg-[var(--studio-total-bg)] px-6 py-2 text-center text-base font-black uppercase tracking-[0.45em] text-[var(--studio-total-text)]">
                        {store?.store_name || "WEBFACTOR"}
                    </div>
                </footer>
            </div>
        </div>
    );
}
