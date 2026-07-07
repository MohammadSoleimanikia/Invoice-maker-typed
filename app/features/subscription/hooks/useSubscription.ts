import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/features/shared/lib/api";

import type { Plan, UserSubscription } from "../types/subscription.types";

export function usePlans() {
    return useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const response = await apiFetch<Plan[]>("/api/plans/");
            return response;
        },
        staleTime: 10 * 60 * 1000,
    });
}

type SubscriptionResponse = UserSubscription | { subscription: null };

export function useSubscription() {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const res = await apiFetch<SubscriptionResponse>(
                "/account/subscription/",
            );

            // اگه subscription: null بود
            if (res && "subscription" in res && res.subscription === null) {
                return null;
            }

            // اگه مستقیم object بود
            return res as UserSubscription;
        },
        staleTime: 1 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
}

export function useHasActiveSubscription() {
    const { data: subscription, isLoading } = useSubscription();
    const hasAccess = !!subscription && subscription.is_active;
    return { hasAccess, isLoading };
}
