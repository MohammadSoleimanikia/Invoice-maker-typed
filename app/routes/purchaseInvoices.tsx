// app/routes/purchaseInvoices.tsx
import { Plus, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { CancelPurchaseInvoiceButton } from "@/features/purchase-invoices/components/CancelPurchaseInvoiceButton";
import { CompletePurchaseInvoiceButton } from "@/features/purchase-invoices/components/CompletePurchaseInvoiceButton";
import { PurchaseInvoiceStatusBadge } from "@/features/purchase-invoices/components/PurchaseInvoiceStatusBadge";
import { usePurchaseInvoices } from "@/features/purchase-invoices/hooks/usePurchaseInvoices";
import type { PurchaseInvoice } from "@/features/purchase-invoices/types/purchaseInvoice.types";
import { Button } from "@/features/shared/components/ui/button";
import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
} from "@/features/shared/components/ui/input-group";
import LoadingSpinner from "@/features/shared/components/ui/loadingSpinner";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/features/shared/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";

function formatCurrency(value?: number | null) {
    return Number(value ?? 0).toLocaleString("fa-IR");
}

function formatDate(date?: string | null) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
type PurchaseSearchValues = {
    supplierName: string;
    supplierPhone: string;
    invoiceNumber: string;
};

function buildPurchaseSearchQuery({
    supplierName,
    supplierPhone,
    invoiceNumber,
}: PurchaseSearchValues) {
    const searchParts: string[] = [];

    if (supplierName.trim()) {
        searchParts.push(`supplier=${encodeURIComponent(supplierName.trim())}`);
    }

    if (supplierPhone.trim()) {
        searchParts.push(`phone=${encodeURIComponent(supplierPhone.trim())}`);
    }

    if (invoiceNumber.trim()) {
        searchParts.push(`invoice=${encodeURIComponent(invoiceNumber.trim())}`);
    }

    return searchParts.join("&");
}
export default function PurchaseInvoices() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [supplierName, setSupplierName] = useState("");
    const [supplierPhone, setSupplierPhone] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");

    const pageSize = 20;

    const { data, isLoading, error, refetch } = usePurchaseInvoices({
        page,
        pageSize,
        searchQuery,
        status,
    });

    const applySearch = (values: PurchaseSearchValues) => {
        setSearchQuery(buildPurchaseSearchQuery(values));
        setPage(1);
    };

    const handleSearch = () => {
        applySearch({
            supplierName,
            supplierPhone,
            invoiceNumber,
        });
    };

    const handleRemoveSearchField = (field: keyof PurchaseSearchValues) => {
        const nextValues = {
            supplierName,
            supplierPhone,
            invoiceNumber,
        };

        nextValues[field] = "";

        setSupplierName(nextValues.supplierName);
        setSupplierPhone(nextValues.supplierPhone);
        setInvoiceNumber(nextValues.invoiceNumber);

        applySearch(nextValues);
    };

    const handleReset = () => {
        setSupplierName("");
        setSupplierPhone("");
        setInvoiceNumber("");
        setSearchQuery("");
        setStatus("all");
        setPage(1);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="space-y-4 py-10 text-center">
                <p className="text-red-500">خطا در دریافت فاکتورهای خرید</p>

                <Button variant="outline" onClick={() => refetch()}>
                    تلاش مجدد
                </Button>
            </div>
        );
    }

    const invoices = data?.results ?? [];
    const count = data?.count ?? 0;
    const totalPages = Math.ceil(count / pageSize);
    const hasFilters =
        supplierName ||
        supplierPhone ||
        invoiceNumber ||
        searchQuery ||
        status !== "all";

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">فاکتورهای خرید</h1>
                        <p className="text-sm text-muted-foreground">
                            مدیریت فاکتورهای خرید و تأمین‌کنندگان
                        </p>
                    </div>

                    <Button asChild>
                        <Link to="/purchase-invoices/new">
                            <Plus className="h-4 w-4" />
                            ثبت فاکتور خرید
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger
                                className="w-44 text-right"
                                dir="rtl"
                            >
                                <SelectValue placeholder="وضعیت فاکتور" />
                            </SelectTrigger>

                            <SelectContent dir="rtl" position="popper">
                                <SelectGroup>
                                    <SelectLabel className="text-right text-muted-foreground">
                                        وضعیت
                                    </SelectLabel>

                                    <SelectItem
                                        value="all"
                                        className="text-right"
                                    >
                                        همه فاکتورها
                                    </SelectItem>

                                    <SelectItem
                                        value="pending"
                                        className="text-right"
                                    >
                                        در انتظار
                                    </SelectItem>

                                    <SelectItem
                                        value="completed"
                                        className="text-right"
                                    >
                                        تکمیل‌شده
                                    </SelectItem>

                                    <SelectItem
                                        value="cancelled"
                                        className="text-right"
                                    >
                                        لغوشده
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <InputGroup className="w-64">
                            <InputGroupInput
                                placeholder="نام تأمین‌کننده..."
                                value={supplierName}
                                onChange={(event) =>
                                    setSupplierName(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                className="text-right"
                            />

                            {supplierName && (
                                <InputGroupButton
                                    onClick={() =>
                                        handleRemoveSearchField("supplierName")
                                    }
                                >
                                    <XIcon className="w-4 h-4" />
                                </InputGroupButton>
                            )}

                            <InputGroupButton
                                onClick={handleSearch}
                                className="bg-primary text-primary-foreground"
                            >
                                <SearchIcon className="w-4 h-4" />
                            </InputGroupButton>
                        </InputGroup>

                        <InputGroup className="w-56">
                            <InputGroupInput
                                placeholder="شماره تأمین‌کننده..."
                                value={supplierPhone}
                                onChange={(event) =>
                                    setSupplierPhone(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                className="text-left"
                                dir="ltr"
                            />

                            {supplierPhone && (
                                <InputGroupButton
                                    onClick={() =>
                                        handleRemoveSearchField("supplierPhone")
                                    }
                                >
                                    <XIcon className="w-4 h-4" />
                                </InputGroupButton>
                            )}

                            <InputGroupButton
                                onClick={handleSearch}
                                className="bg-primary text-primary-foreground"
                            >
                                <SearchIcon className="w-4 h-4" />
                            </InputGroupButton>
                        </InputGroup>

                        <InputGroup className="w-56">
                            <InputGroupInput
                                placeholder="شماره فاکتور..."
                                value={invoiceNumber}
                                onChange={(event) =>
                                    setInvoiceNumber(event.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                className="text-left"
                                dir="ltr"
                            />

                            {invoiceNumber && (
                                <InputGroupButton
                                    onClick={() =>
                                        handleRemoveSearchField("invoiceNumber")
                                    }
                                >
                                    <XIcon className="w-4 h-4" />
                                </InputGroupButton>
                            )}

                            <InputGroupButton
                                onClick={handleSearch}
                                className="bg-primary text-primary-foreground"
                            >
                                <SearchIcon className="w-4 h-4" />
                            </InputGroupButton>
                        </InputGroup>

                        {hasFilters && (
                            <Button
                                variant="ghost"
                                onClick={handleReset}
                                size="sm"
                            >
                                پاک کردن همه
                            </Button>
                        )}

                        <span className="mr-auto rounded-md border px-3 py-1 text-sm text-muted-foreground">
                            {count.toLocaleString("fa-IR")} فاکتور
                        </span>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-right">
                                    شماره فاکتور
                                </TableHead>
                                <TableHead className="text-right">
                                    تأمین‌کننده
                                </TableHead>
                                <TableHead className="text-right">
                                    تلفن
                                </TableHead>
                                <TableHead className="text-right">
                                    مبلغ کل
                                </TableHead>
                                <TableHead className="text-right">
                                    وضعیت
                                </TableHead>
                                <TableHead className="text-right">
                                    تاریخ خرید
                                </TableHead>
                                <TableHead className="text-left">
                                    عملیات
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {invoices.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground py-10"
                                    >
                                        فاکتور خریدی یافت نشد.
                                    </TableCell>
                                </TableRow>
                            )}

                            {invoices.map((invoice: PurchaseInvoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">
                                        {invoice.invoice_number || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {invoice.supplier_name || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {invoice.supplier_phone || "-"}
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        {formatCurrency(invoice.total_amount)}{" "}
                                        تومان
                                    </TableCell>

                                    <TableCell>
                                        <PurchaseInvoiceStatusBadge
                                            status={invoice.status}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {formatDate(invoice.purchased_time)}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/purchase-invoices/${invoice.id}`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    مشاهده
                                                </Button>
                                            </Link>

                                            {invoice.status === "pending" && (
                                                <Link
                                                    to={`/purchase-invoices/edit/${invoice.id}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        ویرایش
                                                    </Button>
                                                </Link>
                                            )}

                                            {invoice.status === "pending" && (
                                                <>
                                                    <CompletePurchaseInvoiceButton
                                                        id={invoice.id}
                                                    />

                                                    <CancelPurchaseInvoiceButton
                                                        id={invoice.id}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((current) => current - 1)}
                    >
                        قبلی
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        صفحه {page} از {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((current) => current + 1)}
                    >
                        بعدی
                    </Button>
                </div>
            )}
        </div>
    );
}
