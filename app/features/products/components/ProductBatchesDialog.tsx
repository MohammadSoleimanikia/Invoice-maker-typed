import { useQuery } from "@tanstack/react-query";
import { Boxes, Loader2 } from "lucide-react";
import { useState } from "react";

import type { Product } from "@/features/products/types/product";
import { Button } from "@/features/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/features/shared/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";
import { apiFetch } from "@/features/shared/lib/api";

type InventoryBatch = {
    invoice_number: string;
    product: number;
    quantity_received: number;
    quantity_remaining: number;
    unit_cost: number;
    purchased_time: string;
};

type Props = {
    product: Product;
};

export default function ProductBatchesDialog({ product }: Props) {
    const [open, setOpen] = useState(false);

    const {
        data: batches = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["product-batches", product.id],

        queryFn: () =>
            apiFetch<InventoryBatch[]>(`/user/products/${product.id}/batches/`),

        enabled: open,
        staleTime: 60 * 1000,
        retry: false,
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2"
                >
                    <Boxes className="size-4" />
                    موجودی خریدها
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-[96vw] xl:max-w-[1400px]">
                <DialogHeader>
                    <DialogTitle>موجودی خریدهای {product.name}</DialogTitle>

                    <DialogDescription>
                        خریدهای دارای موجودی به ترتیب FIFO نمایش داده می‌شوند.
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="flex min-h-40 items-center justify-center gap-2">
                        <Loader2 className="size-5 animate-spin" />
                        در حال دریافت موجودی...
                    </div>
                )}

                {isError && (
                    <div className="flex min-h-40 flex-col items-center justify-center gap-3">
                        <p className="text-destructive">
                            دریافت موجودی با خطا مواجه شد.
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => refetch()}
                        >
                            تلاش مجدد
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && batches.length === 0 && (
                    <div className="flex min-h-40 items-center justify-center text-muted-foreground">
                        این کالا موجودی فعالی ندارد.
                    </div>
                )}

                {!isLoading && !isError && batches.length > 0 && (
                    <>
                        <div className="max-h-[55vh] overflow-auto rounded-md border">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted">
                                    <TableRow>
                                        <TableHead>اولویت FIFO</TableHead>
                                        <TableHead>شماره فاکتور</TableHead>
                                        <TableHead>تعداد خرید</TableHead>
                                        <TableHead>باقی‌مانده</TableHead>
                                        <TableHead>قیمت خرید</TableHead>
                                        <TableHead>تاریخ خرید</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {batches.map((batch, index) => (
                                        <TableRow
                                            key={`${batch.product}-${batch.purchased_time}-${index}`}
                                        >
                                            <TableCell>{index + 1}</TableCell>

                                            <TableCell>
                                                {batch.invoice_number ??
                                                    "بدون شماره"}
                                            </TableCell>

                                            <TableCell>
                                                {batch.quantity_received.toLocaleString(
                                                    "fa-IR",
                                                )}{" "}
                                                عدد
                                            </TableCell>

                                            <TableCell className="font-bold text-primary">
                                                {batch.quantity_remaining.toLocaleString(
                                                    "fa-IR",
                                                )}{" "}
                                                عدد
                                            </TableCell>

                                            <TableCell>
                                                {batch.unit_cost.toLocaleString(
                                                    "fa-IR",
                                                )}{" "}
                                                تومان
                                            </TableCell>

                                            <TableCell>
                                                {batch.purchased_time}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            تعداد خریدهای دارای موجودی:{" "}
                            {batches.length.toLocaleString("fa-IR")}
                        </p>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
