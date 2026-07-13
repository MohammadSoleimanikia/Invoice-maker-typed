import type { Dispatch, SetStateAction } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/features/shared/components/ui/select";
import type { TemplateType } from "@/routes/invoices/invoice";

type TemplateSelectorProps = {
    template: "classic" | "modern" | "minimal" | "boutique";
    setTemplate: Dispatch<SetStateAction<TemplateType>>;
};
/**
 * a dropdown selector for selecting the template type
 */
export const TemplateSelector = ({
    template,
    setTemplate,
}: TemplateSelectorProps) => {
    return (
        <Select
            value={template}
            onValueChange={(value: string) => {
                if (
                    value === "classic" ||
                    value === "modern" ||
                    value === "minimal" ||
                    value === "boutique"
                ) {
                    setTemplate(value);
                }
            }}
        >
            <SelectTrigger className="w-fit bg-white">
                <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent position="popper">
                <SelectItem value="classic">کلاسیک</SelectItem>
                <SelectItem value="minimal">مینیمال</SelectItem>
                <SelectItem value="modern">مدرن</SelectItem>
                <SelectItem value="boutique">بوتیک</SelectItem>
            </SelectContent>
        </Select>
    );
};
