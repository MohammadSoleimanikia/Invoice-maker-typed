// src/components/products/productTable.tsx
import { useState } from "react";

import { CategoryBadge } from "@/features/categories/components/CategoryBadge";
import ProductsSkeleton from "@/features/products/components/productsSkeleton";
import { useDeleteProduct } from "@/features/products/hooks/useDeleteProduct";
import { useProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types/product";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";
import { useHasActiveSubscription } from "@/features/subscription/hooks/useSubscription";

import DeleteConfirm from "../../shared/components/ui/deleteConfirm";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../shared/components/ui/pagination";
import EditProductModal from "./editProductModal";
import { ProductTableEmptyState } from "./ProductTableEmptyState";

interface ProductTableProps {
    searchQuery: string;
    onResetSearch?: () => void;
}

export default function ProductTable({
    searchQuery,
    onResetSearch,
}: ProductTableProps) {
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const { hasAccess } = useHasActiveSubscription();

    const { products, count, isLoading, isFetching, error, refetch } =
        useProducts({
            page,
            pageSize,
            search: searchQuery,
        });

    const { deleteProduct, isDeleting } = useDeleteProduct();

    const totalPages = Math.ceil(count / pageSize);
    const hasSearch = searchQuery !== "";
    const isEmpty = !isLoading && products.length === 0 && !error;

    const handleDelete = async (id: number) => {
        try {
            await deleteProduct(id);
            refetch();
        } catch (err) {
            console.log(err);
        }
    };

    const handleResetSearch = () => {
        if (onResetSearch) {
            onResetSearch();
        }
    };

    if (isLoading) {
        return <ProductsSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <div className="text-red-500">خطا در بارگذاری محصولات</div>
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
            <ProductTableEmptyState
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
                        <TableHead>موجودی</TableHead>
                        <TableHead>دسته‌بندی</TableHead>{" "}
                        {/* ✅ جایگزین توضیحات */}
                        <TableHead>قیمت فروش</TableHead>
                        <TableHead>آخرین قیمت خرید</TableHead>
                        <TableHead>عملیات</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products?.map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell className="text-right">
                                {product.name}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            product.stock_quantity <= 0
                                                ? "bg-red-500"
                                                : product.stock_quantity <= 5
                                                  ? "bg-yellow-500"
                                                  : "bg-green-500"
                                        }`}
                                    />
                                    <span>
                                        {product.stock_quantity.toLocaleString()}{" "}
                                        عدد
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <CategoryBadge category={product.category} />
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                                {product.price.toLocaleString()} تومان
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                                {product.last_buy_price?.toLocaleString() ||
                                    "-"}{" "}
                                تومان
                            </TableCell>
                            <TableCell className="space-x-2">
                                <DeleteConfirm
                                    title="کالا"
                                    onConfirm={() => handleDelete(product.id)}
                                    disabled={isDeleting}
                                />
                                <EditProductModal product={product} />
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

            {isFetching && !isLoading && (
                <div className="text-center text-sm text-muted-foreground mt-2">
                    در حال بروزرسانی...
                </div>
            )}
        </>
    );
}
