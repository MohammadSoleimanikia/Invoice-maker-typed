// features/subscription/components/PlansList.tsx

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/features/shared/components/ui/card";

type StaticPlan = {
    id: number;
    name: string;
    price: number;
    durationText: string;
    isTrial?: boolean;
};

const PLANS: StaticPlan[] = [
    {
        id: 1,
        name: "آزمایشی",
        price: 0,
        durationText: "۱۵ روز",
        isTrial: true,
    },
    {
        id: 2,
        name: "۶ ماه",
        price: 1_500_000,
        durationText: "۶ ماه",
    },
    {
        id: 3,
        name: "یک ساله",
        price: 3_000_000,
        durationText: "۱ سال",
    },
];

function formatPrice(price: number) {
    if (price === 0) {
        return "۰";
    }

    return price.toLocaleString("fa-IR");
}

export function PlansList() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLANS.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>

                        {plan.isTrial && (
                            <CardDescription className="text-primary">
                                ✨ دوره آزمایشی رایگان
                            </CardDescription>
                        )}
                    </CardHeader>

                    <CardContent>
                        <div className="mt-4">
                            <span className="text-3xl font-bold">
                                {formatPrice(plan.price)}
                            </span>

                            <span className="mr-1 text-muted-foreground">
                                تومان
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            برای {plan.durationText}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
