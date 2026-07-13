// routes/dashboard/dashboardLayout.tsx
import { Outlet } from "react-router";

import { DashboardHeader } from "@/features/dashboard/components/dashboardHeader";
import { AppSidebar } from "@/features/shared/components/sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/features/shared/components/ui/sidebar";

export default function DashboardLayout() {
    return (
        <SidebarProvider className="print:block print:min-h-0">
            <AppSidebar  />

            <SidebarInset className="overflow-hidden print:m-0 print:w-full print:overflow-visible">
                {/* هدر */}
                <div className="sticky top-0 z-10 border-b bg-background print:hidden">
                    <div className="flex items-center justify-between px-4 py-2">
                        <SidebarTrigger className="md:flex" />
                        <DashboardHeader />
                    </div>
                </div>

                <main
                    className="
                        flex-1 overflow-y-auto p-4
                        print:h-auto
                        print:overflow-visible
                        print:p-0
                    "
                >
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
