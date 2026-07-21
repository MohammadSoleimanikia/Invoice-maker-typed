import type { Dispatch, SetStateAction } from "react";

import type { TemplateType } from "@/features/invoices/types/invoicePreview.type";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/features/shared/components/ui/select";

type TemplateSelectorProps = {
    template: TemplateType;
    setTemplate: Dispatch<SetStateAction<TemplateType>>;
};

export const TemplateSelector = ({
    template,
    setTemplate,
}: TemplateSelectorProps) => {
    return (
        <Select
            value={template}
            onValueChange={(value) => {
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
                <SelectValue placeholder="قالب" />
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
