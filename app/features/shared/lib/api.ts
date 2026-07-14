const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getCookie(name: string) {
    const cookies = document.cookie.split("; ");

    const cookie = cookies.find((row) => row.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const isFormData = options.body instanceof FormData;

    const method = options.method?.toUpperCase() || "GET";
    const needsCsrf = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
    const csrfToken = getCookie("csrftoken");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            Accept: "application/json",
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(needsCsrf && csrfToken
                ? { "X-CSRFToken": csrfToken }
                : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        let errorBody: any = null;

        try {
            errorBody = await response.json();
        } catch {
            errorBody = null;
        }

        throw errorBody || new Error("Request failed");
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        return undefined as T;
    }

    return response.json();
}