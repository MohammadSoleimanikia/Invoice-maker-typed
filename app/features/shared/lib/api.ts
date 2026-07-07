import { getStoredToken } from "../../auth/lib/authStorage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function refreshToken() {
    const token = getStoredToken();
    if (!token?.refresh) return null;

    const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: token.refresh }),
    });

    if (!res.ok) return null;

    const newToken = await res.json();

    // update zustand persisted state
    const saved = JSON.parse(localStorage.getItem("auth")!);
    saved.state.token.access = newToken.access;
    localStorage.setItem("auth", JSON.stringify(saved));

    return newToken.access;
}

/**
 * Helper to get cache prefixes that should be invalidated based on request type
 * Returns base prefixes so all variations (with/without pagination) are invalidated
 */
function getInvalidationPrefixes(url: string, method?: string): string[] {
    const prefixes: string[] = [];

    // Invoices
    if (url.includes("/user/invoices/")) {
        if (method === "POST") {
            prefixes.push("/user/invoices/", "/user/dashboard/");
        } else if (method === "PUT" || method === "PATCH") {
            prefixes.push("/user/invoices/", "/user/dashboard/");
        } else if (method === "DELETE") {
            prefixes.push("/user/invoices/", "/user/dashboard/");
        }
    }

    // Products
    if (url.includes("/user/products/")) {
        if (method === "POST") {
            prefixes.push("/user/products/", "/user/dashboard/");
        } else if (method === "PUT" || method === "PATCH") {
            prefixes.push("/user/products/", "/user/dashboard/");
        } else if (method === "DELETE") {
            prefixes.push("/user/products/", "/user/dashboard/");
        }
    }

    // Profile
    if (url.includes("/account/profile/")) {
        if (method === "PUT" || method === "PATCH") {
            prefixes.push("/account/profile/", "/user/dashboard/");
        }
    }

    // Customers
    if (url.includes("/account/customers/")) {
        if (method === "POST") {
            prefixes.push("/account/customers/");
        } else if (method === "PUT" || method === "PATCH") {
            prefixes.push("/account/customers/");
        } else if (method === "DELETE") {
            prefixes.push("/account/customers/");
        }
    }

    return [...new Set(prefixes)]; // Remove duplicates
}

export async function apiFetch<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const method = options.method?.toUpperCase() || "GET";

    // 🌐 If no cache or not GET, fetch from API
    const token = getStoredToken();

    // Build headers but avoid forcing Content-Type when body is FormData
    const providedHeaders = (options.headers as Record<string, string>) || {};
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...providedHeaders,
    };

    if (token?.access) {
        headers.Authorization = `Bearer ${token.access}`;
    }

    let res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        const newAccess = await refreshToken();

        if (!newAccess) {
            localStorage.removeItem("auth");
            window.location.href = "/login";
            throw {
                status: 401,
                message: "Session expired",
            };
        }

        headers.Authorization = `Bearer ${newAccess}`;
        res = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
        });
    }

    const text = await res.text();
    let data: any = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: text };
    }

    if (!res.ok) {
        throw {
            status: res.status,
            message:
                data?.message ||
                Object.values(data || {})[0] ||
                "Unknown error",
            errors: data,
        };
    }

    // 🗑️ If POST/PUT/DELETE, invalidate related caches by prefix
    if (method !== "GET") {
        const prefixesToInvalidate = getInvalidationPrefixes(url, method);
        if (prefixesToInvalidate.length > 0) {
            // Invalidate all cache entries that contain these prefixes

            try {
                // Record that a write happened so other tabs/components can decide to refresh
                localStorage.setItem("lastWriteAt", String(Date.now()));
            } catch (e) {
                console.log(e);
                // ignore storage errors
            }
        }
    }

    return data as T;
}
