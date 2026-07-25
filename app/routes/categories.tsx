// routes/categories.tsx
import { FolderTree, Search, Trash, X } from "lucide-react";
import { useRef, useState } from "react";

import AddCategoryModal from "@/features/categories/components/AddCategoryModal";
import EditCategoryModal from "@/features/categories/components/EditCategoryModal";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useDeleteCategory } from "@/features/categories/hooks/useDeleteCategory";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import DeleteConfirm from "@/features/shared/components/ui/deleteConfirm";
import { Input } from "@/features/shared/components/ui/input";
import LoadingSpinner from "@/features/shared/components/ui/loadingSpinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";

export default function CategoriesPage() {
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [page] = useState(1);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, isLoading } = useCategories({
        page,
        search: searchQuery,
    });
    const { mutateAsync: deleteCategory } = useDeleteCategory();

    if (isLoading) return <LoadingSpinner />;

    const handleDelete = async (id: number) => {
        await deleteCategory(id);
    };

    const handleSearch = () => {
        
        if (searchInput.trim()) {
            setSearchQuery(searchInput.trim());
            
            setIsSearching(true);
        }
    };

    const handleReset = () => {
        setSearchInput("");
        setSearchQuery("");
        setIsSearching(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        if (isSearching && e.target.value === "") {
            setIsSearching(false);
            setSearchQuery("");
        }
    };

    return (
        <div className="space-y-6">
            {/* هدر صفحه */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
                    <p className="text-muted-foreground text-sm">
                        مدیریت دسته‌بندی محصولات برای سازماندهی بهتر
                    </p>
                </div>
                <AddCategoryModal />
            </div>

            {/* جستجو و فیلتر */}
            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            ref={inputRef}
                            placeholder="جستجوی دسته‌بندی..."
                            value={searchInput}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="pr-9"
                        />
                        {searchInput && (
                            <button
                                onClick={handleReset}
                                className="absolute left-3 top-1/2 -translate-y-1/2 hover:text-destructive"
                            >
                                <span className="sr-only">close</span>
                                <X className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                            </button>
                        )}
                    </div>

                    {/* دکمه جستجو */}
                    <Button
                        onClick={handleSearch}
                        disabled={!searchInput.trim()}
                        className="whitespace-nowrap"
                    >
                        <Search className="h-4 w-4 ml-2" />
                        جستجو
                    </Button>

                    {/* نمایش تعداد */}
                    <Badge variant="outline" className="whitespace-nowrap">
                        {data?.count || 0} دسته‌بندی
                    </Badge>
                </div>

                {/* نمایش عبارت جستجو */}
                {isSearching && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        نتایج جستجو برای:{" "}
                        <span className="font-medium">"{searchInput}"</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="mr-2 h-6 px-2 text-xs"
                        >
                            <X className="h-3 w-3 ml-1" />
                            پاک کردن
                        </Button>
                    </div>
                )}
            </Card>

            {/* جدول دسته‌بندی‌ها */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">#</TableHead>
                            <TableHead>نام دسته‌بندی</TableHead>
                            <TableHead>توضیحات</TableHead>
                            <TableHead className="text-left">عملیات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.results?.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    {isSearching ? (
                                        <div>
                                            <p>
                                                هیچ دسته‌بندی با عبارت "
                                                {searchInput}" یافت نشد
                                            </p>
                                            <Button
                                                variant="link"
                                                onClick={handleReset}
                                                className="mt-2"
                                            >
                                                نمایش همه دسته‌بندی‌ها
                                            </Button>
                                        </div>
                                    ) : (
                                        "هیچ دسته‌بندی ثبت نشده است"
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.results?.map((category, index) => (
                                <TableRow key={category.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FolderTree className="h-4 w-4 text-muted-foreground" />
                                            {category.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {category.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <EditCategoryModal
                                                category={category}
                                            />
                                            <DeleteConfirm
                                                title="دسته‌بندی"
                                                onConfirm={() =>
                                                    handleDelete(category.id)
                                                }
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
