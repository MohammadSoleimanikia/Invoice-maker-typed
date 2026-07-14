import { Navigate, Outlet } from "react-router";

import { useUser } from "@/features/auth/hooks/useUser";
import LoadingSpinner from "@/features/shared/components/ui/loadingSpinner";

export default function Protected() {
    const { user, isLoading, isError } = useUser();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}