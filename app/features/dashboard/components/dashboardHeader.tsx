// features/dashboard/components/DashboardHeader.tsx
import { Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useProfile } from "@/features/profile/hooks/useProfile";
import { useTheme } from "@/features/shared/components/themeProvider";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { Button } from "@/features/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { buildLogoUrl } from "@/lib/utils";
import useAuth from "@/store/auth";

export function DashboardHeader() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const logOut = useAuth((state) => state.logOut);
    const { data: profile } = useProfile();

    const fullName =
        [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
        "کاربر عزیز";

    const handleLogout = () => {
        logOut();
        toast.success("با موفقیت خارج شدید");
        navigate("/login");
    };
    const logoUrl = profile?.profile?.logo
        ? buildLogoUrl(profile.profile.logo)
        : null;
    return (
        <header className="flex justify-between items-center px-4 py-2 border-b bg-background">
            <div className="flex items-center gap-2">
                {/* change theme button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="rounded-full"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">تغییر تم</span>
                </Button>

                {/* Avatar Dropdown */}
                <DropdownMenu dir="rtl">
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="rounded-full p-0.5 h-auto w-auto border-2 border-border hover:border-primary transition-colors duration-200"
                        >
                            <Avatar className="h-9 w-9 bg-white">
                                {logoUrl ? (
                                    <AvatarImage
                                        src={logoUrl}
                                        alt={fullName}
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        <User className="h-5 w-5" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <div className="flex items-center gap-3 px-3 py-2 border-b">
                            <Avatar className="h-8 w-8">
                                {logoUrl ? (
                                    <AvatarImage
                                        src={logoUrl}
                                        alt={fullName}
                                        className="object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-muted">
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                    {fullName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {profile?.profile?.store_name || "فروشگاه"}
                                </span>
                            </div>
                        </div>

                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuItem
                                onClick={() => navigate("/profile")}
                                className="cursor-pointer text-right flex justify-between"
                            >
                                <span>پروفایل</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate("/subscription")}
                                className="cursor-pointer text-right flex justify-between"
                            >
                                <span>اشتراک</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 focus:text-red-600 cursor-pointer text-right flex justify-between"
                        >
                            <span>خروج از حساب</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
