// features/customers/components/customersTable.tsx
import { useState } from "react";
import { useNavigate } from "react-router";

import type { Customer } from "@/features/customers/types/customer";
import DeleteConfirm from "@/features/shared/components/ui/deleteConfirm";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/features/shared/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";
import { useHasActiveSubscription } from "@/features/subscription/hooks/useSubscription";

import { Button } from "../../shared/components/ui/button";
import { useCustomers } from "../hooks/useCustomers";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
import CustomersSkeleton from "./customersSkeleton";
import { CustomersTableEmptyState } from "./CustomersTableEmptyState";
import UpdateCustomerModal from "./UpdateCustomerModal";

interface CustomersTableProps {
    searchQuery?: string;
    onResetSearch?: () => void;
}

export default function CustomersTable({
    searchQuery = "",
    onResetSearch,
}: CustomersTableProps) {
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const navigate = useNavigate();
    const { hasAccess } = useHasActiveSubscription();

    const { data, isLoading } = useCustomers({
        page,
        pageSize,
    });
    const { mutateAsync: deleteCustomer } = useDeleteCustomer();

    const customers = data?.results || [];
    const count = data?.count || 0;
    const totalPages = Math.ceil(count / pageSize);
    const hasSearch = searchQuery !== "";
    const isEmpty = !isLoading && customers.length === 0;

    const handleDelete = async (id: number) => {
        await deleteCustomer(id);
    };

    const handleViewReports = (customerId: number) => {
        navigate(`/customers/${customerId}/reports`);
    };

    const handleResetSearch = () => {
        if (onResetSearch) {
            onResetSearch();
        }
    };

    if (isLoading) {
        return <CustomersSkeleton />;
    }

    if (isEmpty) {
        return (
            <CustomersTableEmptyState
                hasSearch={hasSearch}
                searchQuery={searchQuery}
                onReset={handleResetSearch}
                hasAccess={hasAccess}
            />
        );
    }

    return (
        <>
            <Table className="my-5">
                <TableHeader className="bg-muted rounded-sm">
                    <TableRow>
                        <TableHead>نام</TableHead>
                        <TableHead>آدرس</TableHead>
                        <TableHead>شماره تلفن</TableHead>
                        <TableHead>عملیات</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {customers?.map((c: Customer) => (
                        <TableRow key={c.id}>
                            <TableCell className="text-right">
                                {c.name}
                            </TableCell>
                            <TableCell>{c.address || "-"}</TableCell>
                            <TableCell className="text-right">
                                {c.phone_number}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleViewReports(c.id)}
                                    >
                                        گزارشات
                                    </Button>
                                    <DeleteConfirm
                                        onConfirm={() => handleDelete(c.id)}
                                        title="مشتری"
                                    />
                                    <UpdateCustomerModal customer={c} />
                                </div>
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
        </>
    );
}
