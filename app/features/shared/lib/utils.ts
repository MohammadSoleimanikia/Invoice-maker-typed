import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Builds a logo source for API paths, absolute URLs and local demo data URLs.
 */
export function buildLogoUrl(
    logo: string | null | undefined,
    cacheBust?: string | number | null,
): string | null {
    if (!logo) return null;

    const normalizedLogo = logo.trim();

    // Local demo uploads must remain untouched and must not depend on API URL.
    if (
        normalizedLogo.startsWith("data:") ||
        normalizedLogo.startsWith("blob:")
    ) {
        return normalizedLogo;
    }

    try {
        const isAbsolute = /^https?:\/\//i.test(normalizedLogo);
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        if (!isAbsolute && !baseUrl) {
            return normalizedLogo;
        }

        const url = isAbsolute
            ? new URL(normalizedLogo)
            : new URL(normalizedLogo, baseUrl);

        if (cacheBust) {
            url.searchParams.set("cb", String(cacheBust));
        }

        return url.toString();
    } catch (error) {
        console.error("Invalid logo URL:", logo, error);
        return null;
    }
}

export function phoneFormatter(phone: string | undefined | null): string {
    if (!phone) return "";
    return phone.startsWith("+98") ? "0" + phone.slice(3) : phone;
}
