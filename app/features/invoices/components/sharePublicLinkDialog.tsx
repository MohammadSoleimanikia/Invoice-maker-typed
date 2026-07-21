// features/invoices/components/SharePublicLinkDialog.tsx
import { Copy, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/features/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import { Input } from "@/features/shared/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";

type SharePublicLinkDialogProps = {
    invoiceToken: string;
    buttonVariant?: "ghost" | "outline" | "default";
    buttonSize?: "icon" | "sm" | "default";
    buttonClassName?: string;
    showLabel?: boolean;
};

export default function SharePublicLinkDialog({
    invoiceToken,
    buttonVariant = "ghost",
    buttonSize = "icon",
    buttonClassName = "h-8 w-8",
    showLabel = false,
}: SharePublicLinkDialogProps) {
    const [open, setOpen] = useState(false);

    const publicUrl = useMemo(() => {
        if (!invoiceToken) return "";

        const publicSiteUrl = (
            import.meta.env.VITE_PUBLIC_SITE_URL || "https://webfactor.ir"
        ).replace(/\/+$/, "");

        return `${publicSiteUrl}/i/${encodeURIComponent(invoiceToken)}`;
    }, [invoiceToken]);

    const handleCopy = async () => {
        if (!publicUrl) {
            toast.error("لینک آماده نیست");
            return;
        }

        try {
            await navigator.clipboard.writeText(publicUrl);
            toast.success("لینک فاکتور کپی شد");
        } catch {
            toast.error("خطا در کپی لینک");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                variant={buttonVariant}
                                size={buttonSize}
                                title="اشتراک لینک عمومی"
                                className={buttonClassName}
                                disabled={!invoiceToken}
                            >
                                <Share2 className="h-4 w-4" />
                                {showLabel && <span>اشتراک لینک</span>}
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>

                    <TooltipContent side="bottom">
                        <p>اشتراک لینک فاکتور</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>اشتراک لینک عمومی</DialogTitle>
                    <DialogDescription>
                        از این لینک برای ارسال فاکتور به مشتری بدون نیاز به ورود
                        استفاده کنید.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center gap-2">
                    <Input
                        readOnly
                        value={publicUrl}
                        className="flex-1"
                        dir="ltr"
                    />

                    <Button
                        type="button"
                        size="icon"
                        onClick={handleCopy}
                        title="کپی لینک"
                        disabled={!publicUrl}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
