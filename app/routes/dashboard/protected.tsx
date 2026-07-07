import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import useAuth from "@/features/auth/store/authStore";

export default function Protected() {
    const token = useAuth((state) => state.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    if (!token) {
        return null; // or a loading spinner
    }

    return <Outlet />;
}
