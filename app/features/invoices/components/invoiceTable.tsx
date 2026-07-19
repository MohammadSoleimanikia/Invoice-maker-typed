import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { invoiceStatusFa } from "@/features/invoices/constants/invoice";
import { useDeleteInvoice } from "@/features/invoices/hooks/useDeleteInvoice";
import { useInvoices } from "@/features/invoices/hooks/useInvoices";
import { useMarkInvoiceAsPaid } from "@/features/invoices/hooks/useMarkInvoiceAsPaid";
import type { Invoice } from "@/features/invoices/types/invoicePreview.type";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";

import { Badge } from "../../shared/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../shared/components/ui/pagination";
import InvoiceActions from "./invoiceActions";
import InvoiceSkeleton from "./invoiceSkeleton";
import { InvoiceTableEmptyState } from "./InvoiceTableEmptyState";

interface InvoiceTableProps {
    searchQuery: string;
    status: string;
}

export default function InvoiceTable({
    searchQuery,
    status,
}: InvoiceTableProps) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const { invoices, count, isLoading, error, refetch } = useInvoices({
        page,
        pageSize,
        searchQuery,
        status,
    });

    const { mutateAsync: deleteInvoice, isPending: isDeleting } =
        useDeleteInvoice();
    const { mutateAsync: markAsPaid, isPending: isPaying } =
        useMarkInvoiceAsPaid();

    const totalPages = Math.ceil(count / pageSize);
    const hasFilters = searchQuery !== "" || status !== "all";
    const isEmpty = !isLoading && invoices.length === 0 && !error;

    const handleResetFilters = () => {
        // اینجا باید فیلترها را ریست کنید
        // از طریق props به parent کامپوننت
        window.location.reload(); 
    };

    const handleDelete = async (
        id: string,
        invoiceStatus: string | undefined,
    ) => {
        if (invoiceStatus === "paid") {
            toast.error("فاکتور پرداخت شده را نمی‌توان حذف کرد");
            return;
        }

        try {
            await deleteInvoice({ id });
            toast.success("فاکتور با موفقیت حذف شد");
            await refetch();
        } catch (err) {
            console.log(err);
            toast.error("خطا در حذف فاکتور");
        }
    };

    const handleEdit = (id: string, invoiceStatus: string | undefined) => {
        if (invoiceStatus === "paid") {
            toast.error("فاکتور پرداخت شده را نمی‌توان ویرایش کرد");
            return;
        }
        navigate(`/invoices/edit/${id}`);
    };

    const handlePaid = async (
        id: string,
        invoiceStatus: string | undefined,
    ) => {
        if (invoiceStatus === "paid") {
            toast.error("فاکتور از قبل پرداخت شده است");
            return;
        }

        try {
            await markAsPaid({ id });
            toast.success("فاکتور با موفقیت به پرداخت شده تغییر یافت");
            refetch();
        } catch (err) {
            console.log(err);
            toast.error("خطا در تغییر وضعیت فاکتور");
        }
    };

    if (isLoading) {
        return <InvoiceSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <div className="text-red-500">خطا در بارگذاری فاکتورها</div>
                <button
                    onClick={() => refetch()}
                    className="mt-2 text-blue-500 hover:underline"
                >
                    تلاش مجدد
                </button>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <InvoiceTableEmptyState
                hasFilters={hasFilters}
                searchQuery={searchQuery}
                status={status}
                onReset={handleResetFilters}
            />
        );
    }

    return (
        <div className="my-5">
            <Table className="my-5">
                <TableHeader className="bg-muted rounded-sm">
                    <TableRow>
                        <TableHead>شماره فاکتور</TableHead>
                        <TableHead>نام مشتری</TableHead>
                        <TableHead>تاریخ ایجاد</TableHead>
                        <TableHead>مبلغ کل</TableHead>
                        <TableHead>وضعیت</TableHead>
                        <TableHead>عملیات</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {invoices?.map((invoice: Invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>
                                {invoice.invoice_number || "-"}
                            </TableCell>
                            <TableCell>
                                {invoice.customer_name || "-"}
                            </TableCell>
                            
                           
                            
                            <TableCell>
                                {invoice.created.split(" ")[0]}
                            </TableCell>
                            <TableCell>
                                {invoice.total_amount.toLocaleString("fa-IR")}{" "}
                                تومان
                            </TableCell>
                             <TableCell className="text-right">
                                {invoice.status ? (
                                    <Badge
                                        className={clsx("bg-slate-600", {
                                            "bg-green-100 text-green-900":
                                                invoice.status === "paid",
                                            "bg-yellow-100 text-yellow-900":
                                                invoice.status === "pending",
                                        })}
                                    >
                                        {invoiceStatusFa[invoice.status]}
                                    </Badge>
                                ) : (
                                    "-"
                                )}
                            </TableCell>
                            <TableCell>
                                <InvoiceActions
                                    invoiceId={invoice.id}
                                    invoiceToken={invoice.public_token}
                                    invoiceStatus={invoice.status}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit}
                                    handlePaid={handlePaid}
                                    isDeleting={isDeleting}
                                    isPaying={isPaying}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="mt-4" dir="rtl">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    page < totalPages && setPage(page + 1)
                                }
                                className={
                                    page === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages })
                            .reverse()
                            .map((_, i) => {
                                const pageNumber = totalPages - i;
                                return (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink
                                            isActive={page === pageNumber}
                                            onClick={() => setPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => page > 1 && setPage(page - 1)}
                                className={
                                    page === 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
