// routes/dashboard/dashboard.tsx
import { FileText, Package, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router";

import PendingInvoicesTable from "@/features/dashboard/components/pendingInvoicesTable";
import RecentInvoicesTable from "@/features/dashboard/components/recentInvoicesTable";
import StatsCards from "@/features/dashboard/components/statsCards";
import { TopProductsChart } from "@/features/dashboard/components/topProductChart";
import { TrendChart } from "@/features/dashboard/components/trendChart";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { usePendingInvoices } from "@/features/dashboard/hooks/usePendingInvoices";
import { useRecentInvoices } from "@/features/dashboard/hooks/useRecentInvoices";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import LoadingSpinner from "@/features/shared/components/ui/loadingSpinner";
import { useHasActiveSubscription } from "@/features/subscription/hooks/useSubscription";

export default function Dashboard() {
    const { data: dashboardData, isLoading: statsLoading } =
        useDashboardStats();
    const { data: recentData, isLoading: recentLoading } = useRecentInvoices(5);
    const { data: pendingData, isLoading: pendingLoading } =
        usePendingInvoices(5);
    const { hasAccess } = useHasActiveSubscription();

    const { data: profile, isLoading: profileLoading } = useProfile();

    const isLoading =
        statsLoading || recentLoading || pendingLoading || profileLoading;

    if (isLoading) return <LoadingSpinner />;

    const userProfile = profile ;

    const isProfileComplete = () => {
        if (!userProfile) return false;
        const requiredFields = [
            userProfile.first_name,
            userProfile.last_name,
            userProfile.phone_number,
            userProfile.profile?.store_name,
        ];
        return requiredFields.every((field) => field && field.trim() !== "");
    };

    const fullName =
        [userProfile?.first_name, userProfile?.last_name]
            .filter(Boolean)
            .join(" ") || "کاربر";
    const storeName = userProfile?.profile?.store_name;

    return (
        <main className="text-right">
            <div className="mb-2">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    خوش آمدی، {fullName} عزیز!
                </h1>
                {storeName && (
                    <p className="text-xl text-muted-foreground mt-1 flex items-center gap-1">
                        {storeName}
                    </p>
                )}
            </div>
            {!isProfileComplete() && (
                <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                    <AlertDescription className="flex items-center justify-between text-yellow-800 dark:text-yellow-300">
                        <span>
                            ⚠️ پروفایل شما ناقص است. لطفاً اطلاعات خود را تکمیل
                            کنید.
                        </span>
                        <Link to="/profile">
                            <Button variant="ghost" size="sm">
                                تکمیل پروفایل
                            </Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            {hasAccess && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 mt-6">
                    <Link to="/invoices/new">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            size="lg"
                        >
                            <FileText className="w-4 h-4" />
                            فاکتور جدید
                        </Button>
                    </Link>
                    <Link to="/purchase-invoices/new">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            size="lg"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            فاکتور خرید
                        </Button>
                    </Link>
                    <Link to="/products">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            size="lg"
                        >
                            <Package className="w-4 h-4" />
                            ثبت کالا
                        </Button>
                    </Link>
                    <Link to="/customers">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            size="lg"
                        >
                            <Users className="w-4 h-4" />
                            ثبت مشتری
                        </Button>
                    </Link>
                </div>
            )}

            {!hasAccess && (
                <div className="bg-muted rounded-lg p-4 mb-8 mt-6 text-center">
                    <p className="text-muted-foreground mb-2">
                        برای استفاده از امکانات وب‌فاکتور، ابتدا اشتراک تهیه
                        کنید.
                    </p>
                    <Link to="/subscription">
                        <Button variant="default" size="sm">
                            مشاهده تعرفه‌ها
                        </Button>
                    </Link>
                </div>
            )}

            <StatsCards dashboardData={dashboardData} />

            <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
                <RecentInvoicesTable recentData={recentData} />
                <PendingInvoicesTable pendingData={pendingData} />
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4">
                {dashboardData?.trends && (
                    <TrendChart chartData={dashboardData.trends} />
                )}
                {dashboardData?.top_products && (
                    <TopProductsChart chartData={dashboardData.top_products} />
                )}
            </div>
        </main>
    );
}
