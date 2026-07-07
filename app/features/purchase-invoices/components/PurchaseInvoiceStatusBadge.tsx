// app/features/purchase-invoices/components/PurchaseInvoiceStatusBadge.tsx
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/features/shared/lib/utils";

import type { PurchaseInvoiceStatus } from "../types/purchaseInvoice.types";

const statusMap: Record<
    PurchaseInvoiceStatus,
    {
        label: string;
        className: string;
    }
> = {
    pending: {
        label: "در انتظار",
        className: "bg-yellow-100 text-yellow-900 hover:bg-yellow-100",
    },
    completed: {
        label: "تکمیل‌شده",
        className: "bg-green-100 text-green-900 hover:bg-green-100",
    },
    cancelled: {
        label: "لغوشده",
        className: "bg-red-100 text-red-900 hover:bg-red-100",
    },
};

type PurchaseInvoiceStatusBadgeProps = {
    status: PurchaseInvoiceStatus;
    className?: string;
};

export function PurchaseInvoiceStatusBadge({
    status,
    className,
}: PurchaseInvoiceStatusBadgeProps) {
    const config = statusMap[status];

    return (
        <Badge className={cn(config.className, className)}>
            {config.label}
        </Badge>
    );
}
