import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => undefined,
};

const ThemeProviderContext =
    createContext<ThemeProviderState>(initialState);

function isTheme(value: string | null): value is Theme {
    return (
        value === "dark" ||
        value === "light" ||
        value === "system"
    );
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
    const [theme, setThemeState] =
        useState<Theme>(defaultTheme);

    useEffect(() => {
        const storedTheme =
            window.localStorage.getItem(storageKey);

        if (isTheme(storedTheme)) {
            setThemeState(storedTheme);
        }
    }, [storageKey]);

    // اعمال کلاس theme فقط در مرورگر
    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        window.localStorage.setItem(
            storageKey,
            newTheme,
        );

        setThemeState(newTheme);
    };

    return (
        <ThemeProviderContext.Provider
            value={{ theme, setTheme }}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeProviderContext);
}