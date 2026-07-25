import { Navigate, Outlet } from "react-router";

import { useUser } from "@/features/auth/hooks/useUser";

export default function GuestOnly() {
    const { user } = useUser();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}