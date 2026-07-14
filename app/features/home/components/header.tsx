import { Link, NavLink } from "react-router";

import useAuth from "@/features/auth/store/authStore";
import ThemeToggler from "@/features/home/components/themeToggler";
import { Button } from "@/features/shared/components/ui/button";

export function Header() {
    const isLoggedIn = useAuth((state) => state.isAuthenticated);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:hidden py-2 gap-2">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                className="h-8 w-auto"
                                src="/logo.svg"
                                alt="وب فاکتور"
                            />
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                                وب فاکتور
                            </span>
                        </Link>
                        <ThemeToggler />
                    </div>

                    <div className="flex gap-2">
                        {!isLoggedIn && (
                            <Link to="/demo" className="flex-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    ساخت رایگان فاکتور
                                </Button>
                            </Link>
                        )}

                        <NavLink
                            to={isLoggedIn ? "/dashboard" : "/login"}
                            className="flex-1"
                        >
                            <Button size="sm" className="w-full">
                                {isLoggedIn ? "داشبورد" : "ورود/عضویت"}
                            </Button>
                        </NavLink>
                    </div>
                </div>

                <div className="hidden sm:flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            className="h-8 w-auto"
                            src="/logo.svg"
                            alt="وب فاکتور"
                        />
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                            وب فاکتور
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <ThemeToggler />

                        {!isLoggedIn && (
                            <Link to="/demo">
                                <Button variant="outline" size="sm">
                                    ساخت رایگان فاکتور
                                </Button>
                            </Link>
                        )}

                        <NavLink to={isLoggedIn ? "/dashboard" : "/login"}>
                            <Button size="sm">
                                {isLoggedIn ? "داشبورد" : "ورود/عضویت"}
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
}
