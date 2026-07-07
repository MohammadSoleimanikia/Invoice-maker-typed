import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
/**
 * Build the correct logo URL
 * Handles both private (relative path) and public (may include domain) responses
 */
export function buildLogoUrl(
    logo: string | null | undefined,
    cacheBust?: string | number | null,
): string | null {
    if (!logo) return null;

    try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const url = new URL(logo, baseUrl);
        
        if (cacheBust) {
            url.searchParams.set('cb', String(cacheBust));
        }
        
        return url.toString();
    } catch (error) {
        console.error('Invalid logo URL:', logo, error);
        return null;
    }
}
export function phoneFormatter(phone: string | undefined | null): string {
    if (!phone) return "";
    return phone.startsWith("+98") ? "0" + phone.slice(3) : phone;
}
