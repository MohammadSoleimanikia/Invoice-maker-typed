export const INVOICE_TEMPLATE_VALUES = [
    "classic",
    "modern",
    "minimal",
    "boutique",
] as const;

export type TemplateType = (typeof INVOICE_TEMPLATE_VALUES)[number];

export const DEFAULT_INVOICE_TEMPLATE: TemplateType = "boutique";

export const invoiceTemplateFa: Record<TemplateType, string> = {
    classic: "کلاسیک",
    modern: "مدرن",
    minimal: "مینیمال",
    boutique: "بوتیک",
};

export const invoiceTemplateOptions = INVOICE_TEMPLATE_VALUES.map((value) => ({
    value,
    label: invoiceTemplateFa[value],
}));

export function isInvoiceTemplate(value: unknown): value is TemplateType {
    return (
        typeof value === "string" &&
        (INVOICE_TEMPLATE_VALUES as readonly string[]).includes(value)
    );
}

export function normalizeInvoiceTemplate(value: unknown): TemplateType {
    const normalized =
        typeof value === "string" ? value.trim().toLowerCase() : value;

    return isInvoiceTemplate(normalized)
        ? normalized
        : DEFAULT_INVOICE_TEMPLATE;
}
