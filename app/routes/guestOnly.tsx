import { Navigate, Outlet } from "react-router";

import { useUser } from "@/features/auth/hooks/useUser";
import LoadingSpinner from "@/features/shared/components/ui/loadingSpinner";

export default function GuestOnly() {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}