// features/products/components/header.tsx
import { FolderTree, SearchIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";

import { Button } from "@/features/shared/components/ui/button";
import { useHasActiveSubscription } from "@/features/subscription/hooks/useSubscription";

import {
    InputGroup,
    InputGroupButton,
    InputGroupInput,
} from "../../shared/components/ui/input-group";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "../../shared/components/ui/tooltip";
import AddProductModal from "./addProductModal";

export default function Header({
    setSearchQuery,
}: {
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [searchInput, setSearchInput] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { hasAccess } = useHasActiveSubscription();

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
        // اگر قبلاً جستجو انجام شده و کاربر متن رو پاک میکنه، حالت جستجو رو غیرفعال کن
        if (isSearching && e.target.value === "") {
            setIsSearching(false);
            setSearchQuery("");
        }
    };

    return (
        <header className="mx-5 mb-5">
            <div className="flex justify-between items-center mb-4">
                <h1 className="title">کالا ها</h1>
                <div className="flex items-center gap-2">
                    {/* دکمه مدیریت دسته‌بندی - لینک به صفحه جداگانه */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Link to="/categories">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!hasAccess}
                                    >
                                        <FolderTree className="h-4 w-4 ml-1" />
                                        مدیریت دسته‌بندی
                                    </Button>
                                </Link>
                            </span>
                        </TooltipTrigger>
                        {!hasAccess && (
                            <TooltipContent>
                                برای مدیریت دسته‌بندی ابتدا اشتراک تهیه کنید
                            </TooltipContent>
                        )}
                    </Tooltip>

                    <AddProductModal disabled={!hasAccess} />
                </div>
            </div>

            <div className="flex justify-between gap-3">
                <InputGroup className="w-64 px-1">
                    <InputGroupInput
                        ref={inputRef}
                        placeholder="جستجو بر اساس نام کالا"
                        value={searchInput}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="text-right"
                    />

                    <InputGroupButton
                        onClick={handleSearch}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={!searchInput.trim()}
                    >
                        <SearchIcon className="w-4 h-4" />
                    </InputGroupButton>

                    {isSearching && (
                        <InputGroupButton
                            onClick={handleReset}
                            className="text-destructive hover:bg-destructive/10"
                        >
                            <XIcon className="w-4 h-4" />
                        </InputGroupButton>
                    )}
                </InputGroup>

                {/* نمایش وضعیت جستجو */}
                {isSearching && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <span>نتایج جستجو برای: "{searchInput}"</span>
                    </div>
                )}
            </div>
        </header>
    );
}
