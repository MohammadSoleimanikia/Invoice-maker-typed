// routes/dashboard/subscription.tsx
import { AlertCircle } from "lucide-react";
import { useState } from "react";

import { usePurchasePlan } from "@/features/payment/hooks/usePayment";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/features/shared/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/features/shared/components/ui/dialog";
import LoadingSpinner from "@/features/shared/components/ui/loadingSpinner";
import { SubscriptionStatus } from "@/features/subscription/components/SubscriptionStatus";
import {
    usePlans,
    useSubscription,
} from "@/features/subscription/hooks/useSubscription";

type Plan = {
    id: number;
    name: string;
    price: number;
    duration: number;
    duration_unit: "day" | "month" | "year";
    is_trial: boolean;
};

export default function SubscriptionPage() {
    const { data: subscription, isLoading: subLoading } = useSubscription();
    const { data: plans, isLoading: plansLoading } = usePlans();
    const { mutateAsync: purchasePlan, isPending } = usePurchasePlan();

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const isLoading = subLoading || plansLoading;

    if (isLoading) return <LoadingSpinner />;

    const hasActiveSubscription = subscription?.is_active === true;
    const currentPlanId = subscription?.plan?.id;

    const getDurationText = (plan: Plan) => {
        switch (plan.duration_unit) {
            case "day":
                return `${plan.duration} روز`;
            case "month":
                return `${plan.duration} ماه`;
            case "year":
                return `${plan.duration} سال`;
            default:
                return `${plan.duration} روز`;
        }
    };

    const addPlanDuration = (plan: Plan) => {
        const endDate = new Date();

        switch (plan.duration_unit) {
            case "day":
                endDate.setDate(endDate.getDate() + plan.duration);
                break;
            case "month":
                endDate.setMonth(endDate.getMonth() + plan.duration);
                break;
            case "year":
                endDate.setFullYear(endDate.getFullYear() + plan.duration);
                break;
            default:
                endDate.setDate(endDate.getDate() + plan.duration);
        }

        return endDate;
    };

    const formatPersianDate = (date: Date) => {
        return date.toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatPrice = (price: number) => {
        if (price === 0) return "رایگان";
        return `${price.toLocaleString("fa-IR")} تومان`;
    };

    const handleSelectPlan = (plan: Plan) => {
        setSelectedPlan(plan);
        setConfirmOpen(true);
    };

    const handleConfirmPurchase = async () => {
        if (!selectedPlan) return;

        try {
            await purchasePlan(selectedPlan.id);
            setConfirmOpen(false);
        } catch (err) {
            console.error("🔴 Purchase error:", err);
        }
    };

    const isCurrentPlan = (planId: number) => currentPlanId === planId;

    const estimatedEndDate = selectedPlan
        ? addPlanDuration(selectedPlan)
        : null;

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">مدیریت اشتراک</h1>
            </div>

            <SubscriptionStatus />

            {hasActiveSubscription && (
                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                        شما هم‌اکنون اشتراک فعال دارید. برای تهیه اشتراک جدید،
                        منتظر اتمام اشتراک فعلی خود بمانید.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">پلن‌های موجود</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans?.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`flex flex-col ${
                                isCurrentPlan(plan.id)
                                    ? "ring-2 ring-primary shadow-lg"
                                    : ""
                            }`}
                        >
                            {isCurrentPlan(plan.id) && (
                                <div className="bg-primary text-white text-center py-1.5 rounded-t-lg text-sm font-medium">
                                    اشتراک فعلی شما
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-xl">
                                    {plan.name}
                                </CardTitle>

                                {plan.is_trial && (
                                    <CardDescription className="text-primary">
                                        ✨ دوره آزمایشی رایگان
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="mt-2">
                                    <span className="text-3xl font-bold">
                                        {formatPrice(plan.price)}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mt-2">
                                    مدت: {getDurationText(plan)}
                                </p>

                                {plan.is_trial && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        * بدون نیاز به پرداخت
                                    </p>
                                )}
                            </CardContent>

                            <CardFooter>
                                {isCurrentPlan(plan.id) ? (
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        disabled
                                    >
                                        فعال
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleSelectPlan(plan)}
                                        disabled={
                                            hasActiveSubscription || isPending
                                        }
                                    >
                                        انتخاب پلن
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>تأیید خرید اشتراک</DialogTitle>
                        <DialogDescription>
                            لطفاً قبل از انتقال به درگاه پرداخت، اطلاعات خرید را
                            بررسی کنید.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPlan && (
                        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">
                                    پلن انتخابی
                                </span>
                                <span className="font-semibold">
                                    {selectedPlan.name}
                                </span>
                            </div>

                            

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">
                                    شروع اشتراک
                                </span>
                                <span className="font-medium">
                                    پس از پرداخت موفق
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">
                                    تاریخ پایان تقریبی
                                </span>
                                <span className="font-medium">
                                    {estimatedEndDate
                                        ? formatPersianDate(estimatedEndDate)
                                        : "-"}
                                </span>
                            </div>

                            <div className="border-t pt-4 flex items-center justify-between gap-4">
                                <span className="text-sm text-muted-foreground">
                                    مبلغ قابل پرداخت
                                </span>
                                <span className="text-lg font-bold text-primary">
                                    {formatPrice(selectedPlan.price)}
                                </span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                            disabled={isPending}
                        >
                            انصراف
                        </Button>

                        <Button
                            type="button"
                            onClick={handleConfirmPurchase}
                            disabled={isPending || !selectedPlan}
                        >
                            {isPending
                                ? "در حال دریافت لینک پرداخت..."
                                : selectedPlan?.price === 0
                                  ? "فعال‌سازی پلن"
                                  : "انتقال به درگاه پرداخت"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
