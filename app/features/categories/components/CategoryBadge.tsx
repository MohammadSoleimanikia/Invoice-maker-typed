// features/categories/components/CategoryBadge.tsx
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/features/shared/lib/utils";

interface CategoryBadgeProps {
    category: { id: number; name: string } | null;
    className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    if (!category) {
        return <span className="text-muted-foreground text-sm">بدون دسته</span>;
    }

    return (
        <Badge
            variant="secondary"
            className={cn("text-sm font-normal", className)}
        >
            {category.name}
        </Badge>
    );
}
