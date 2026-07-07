// components/invoices/invoiceActions.tsx
import { Check, Eye, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { Button } from "../../shared/components/ui/button";
import DeleteConfirm from "../../shared/components/ui/deleteConfirm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../shared/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../shared/components/ui/tooltip";
import SharePublicLinkDialog from "./sharePublicLinkDialog";

type InvoiceActionsProps = {
    invoiceId: string;
    invoiceToken: string;
    invoiceStatus: string | undefined;
    handleDelete: (id: string, status: string | undefined) => void;
    handleEdit: (id: string, status: string | undefined) => void;
    handlePaid: (id: string, status: string | undefined) => void;
    isDeleting: boolean;
    isPaying: boolean;
};


// کامپوننت ConfirmDialog برای تأیید پرداخت
function ConfirmPaidDialog({
    open,
    onOpenChange,
    onConfirm,
    isPaying,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isPaying: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>تغییر وضعیت به پرداخت شده</DialogTitle>
                    <DialogDescription>
                        آیا مطمئن هستید که می‌خواهید وضعیت این فاکتور را به
                        "پرداخت شده" تغییر دهید؟
                        <br />
                        <span className="text-sm text-muted-foreground mt-2 block">
                            این عمل قابل بازگشت نیست.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        انصراف
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isPaying}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isPaying ? "در حال تغییر..." : "تأیید و تغییر وضعیت"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function InvoiceActions({
    invoiceId,
    invoiceToken,
    invoiceStatus,
    handleDelete,
    handleEdit,
    handlePaid,
    isDeleting,
    isPaying,
}: InvoiceActionsProps) {
    const [confirmPaidOpen, setConfirmPaidOpen] = useState(false);
    const isPaid = invoiceStatus === "paid";

    const handlePaidClick = () => {
        if (isPaid) {
            toast.error("فاکتور از قبل پرداخت شده است");
            return;
        }
        setConfirmPaidOpen(true);
    };

    const handleConfirmPaid = async () => {
        await handlePaid(invoiceId, invoiceStatus);
        setConfirmPaidOpen(false);
    };

    return (
        <div className="flex items-center gap-0.5">
            {/* مشاهده فاکتور */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link to={`/invoices/${invoiceId}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>مشاهده فاکتور</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* اشتراک لینک */}
            <SharePublicLinkDialog invoiceToken={invoiceToken} />

            {/* ویرایش فاکتور - فقط در حالت غیرپرداخت شده */}
            {!isPaid && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                    handleEdit(invoiceId, invoiceStatus)
                                }
                                disabled={isDeleting || isPaying}
                            >
                                <SquarePen className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>ویرایش فاکتور</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            {/* تغییر وضعیت به پرداخت شده */}
            {!isPaid && (
                <>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handlePaidClick}
                                    disabled={isDeleting || isPaying}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>تغییر به پرداخت شده</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* دیالوگ تأیید پرداخت */}
                    <ConfirmPaidDialog
                        open={confirmPaidOpen}
                        onOpenChange={setConfirmPaidOpen}
                        onConfirm={handleConfirmPaid}
                        isPaying={isPaying}
                    />
                </>
            )}

            {/* اگر پرداخت شده، یک badge نمایش بده */}
            {isPaid && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    پرداخت شده
                </span>
            )}

            {/* حذف فاکتور - فقط در حالت غیرپرداخت شده */}
            {!isPaid && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DeleteConfirm
                                title="فاکتور"
                                disabled={isDeleting}
                                onConfirm={() =>
                                    handleDelete(invoiceId, invoiceStatus)
                                }
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        disabled={isDeleting || isPaying}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                }
                            />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>حذف فاکتور</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
}
