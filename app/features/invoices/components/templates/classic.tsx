import { MapPinHouse, PhoneCall } from "lucide-react";

import type { User } from "@/features/auth/types/user.type";
import type { InvoiceViewModel } from "@/features/invoices/types/invoicePreview.type";
import { generateBrandingColors } from "@/features/profile/lib/brandingColors";
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
} from "@/features/shared/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";
import { buildLogoUrl, phoneFormatter } from "@/features/shared/lib/utils";
type invoiceProps = {
    invoice: InvoiceViewModel;
    user: User | null;
};
import { useProfile } from "@/features/profile/hooks/useProfile";

import Instagram from "../../../shared/components/instagramIcon";
export default function Classic({ invoice, user }: invoiceProps) {
    const { data: profile } = useProfile();
    // Use passed user for public invoices, fallback to authenticated user profile
    const displayUser = user || profile;
    const colors = displayUser
        ? generateBrandingColors(displayUser.profile.hexcolor)
        : null;
    const brandingLogo = displayUser?.profile.logo;
    return (
        <div className="w-[210mm] min-h-[297mm] mx-auto shrink-0 bg-white dark:bg-muted  print:dark:bg-white p-10 flex flex-col print:page-break-inside-avoid">
            <p className="text-2xl text-center font-bold">
                <span>{invoice.title}</span>
            </p>
            <header className="pb-8">
                <div className="flex flex-col items-center">
                    {brandingLogo ? (
                        <img
                            src={buildLogoUrl(displayUser.profile.logo) || ""}
                            alt="Logo"
                            className="w-36"
                        />
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex justify-center items-center text-slate-500 font-semibold size-32 border-2 border-dashed">
                                    محل قرارگیری لوگو
                                </div>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p>از قسمت پروفایل افزوده شود</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                    {displayUser && brandingLogo && (
                        <p className="ml-4 text-xl font-light">
                            {displayUser.profile.store_name}
                        </p>
                    )}
                </div>
                <p className="text-center text-2xl my-5 font-semibold"></p>
            </header>
            <section className="flex justify-between">
                <div className="text-right w-5/12">
                    <h2 className="font-semibold text-lg">اطلاعات مشتری</h2>
                    <p>
                        <span className="font-semibold">نام : </span>
                        <span>{invoice.customer.name}</span>
                    </p>
                    <p>
                        <span className="font-semibold">آدرس: </span>
                        <span>{invoice.customer.address}</span>
                    </p>
                    <p>
                        <span className="font-semibold">ایمیل: </span>
                        <span>{invoice.customer.email}</span>
                    </p>
                    <p>
                        <span className="font-semibold">تلفن: </span>
                        <span>{invoice.customer.phone}</span>
                    </p>
                </div>
                <div>
                    <p>
                        <span className="font-semibold">شماره فاکتور:</span>
                        <span>{invoice.invoiceNumber}</span>
                    </p>
                    <p>
                        <span className="font-semibold">تاریخ ایجاد: </span>
                        <span>{invoice.createdAt}</span>
                    </p>
                </div>
            </section>
            <section>
                <div className="mt-10">
                    <Table className="w-full border-collapse border border-gray-300">
                        <TableHeader>
                            <TableRow
                                style={{
                                    backgroundColor: colors?.base,
                                    color: colors?.text,
                                    borderColor: colors?.border,
                                }}
                                className="print:bg-gray-200 print:text-black"
                            >
                                <th className="border border-gray-300 p-2 text-right">
                                    نام محصول
                                </th>
                                <th className="border border-gray-300 p-2 text-right">
                                    تعداد
                                </th>
                                <th className="border border-gray-300 p-2 text-right">
                                    قیمت واحد
                                </th>
                                <th className="border border-gray-300 p-2 text-right">
                                    قیمت کل
                                </th>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoice.items.map((item, index) => (
                                <TableRow key={index}>
                                    <td className="border border-gray-300 p-2 text-right">
                                        {item.name}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-right">
                                        {item.unitPrice.toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-right">
                                        {item.total.toLocaleString()}
                                    </td>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-10 space-y-2">
                    {invoice.added_value > 0 && (
                        <p className="flex justify-between items-center py-1">
                            <span className="font-medium text-muted-foreground">
                                مالیات بر ارزش افزوده (۱۰٪):
                            </span>
                            <span className="font-semibold">
                                {invoice.added_value.toLocaleString()} تومان
                            </span>
                        </p>
                    )}

                    {invoice.discount > 0 && (
                        <p className="flex  items-center py-1">
                            <span className="font-medium text-muted-foreground">
                                تخفیف:
                            </span>
                            {invoice.discount.toLocaleString()} تومان
                        </p>
                    )}

                    <p className="flex  items-center py-2 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
                        <span className="text-lg font-bold text-primary">
                            مجموع:
                        </span>
                        <span className="text-xl font-bold text-primary">
                            {invoice.total.toLocaleString()} تومان
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold pl-2">
                            {" "}
                            مجموع به حروف:
                        </span>
                        <span>{invoice.totalText} تومان</span>
                    </p>
                    <p>
                        <span className="font-semibold">وضعیت: </span>
                        <span>{invoice.statusText}</span>
                    </p>

                    <p>
                        <span className="font-semibold">روش پرداخت: </span>
                        <span>{invoice.paymentText}</span>
                    </p>
                </div>
                {invoice.descriptions !== "" && (
                    <div className="mt-5 border-2 border-dashed bg-slate-200 dark:bg-slate-700 print:dark:bg-slate-200 p-3">
                        <span className="font-semibold ">توضیحات: </span>
                        {invoice.descriptions}
                    </div>
                )}
            </section>
            <footer className="mt-auto border-t-2 border-slate-300 text-sm pt-2 flex gap-5 justify-around">
                {displayUser?.profile.insta_link && (
                    <div className="flex gap-2 items-center">
                        <Instagram />
                        {displayUser.profile.insta_link}
                    </div>
                )}
                {displayUser?.phone_number && (
                    <div className="flex gap-2">
                        <PhoneCall />
                        {phoneFormatter(displayUser.phone_number)}
                    </div>
                )}
                {displayUser?.profile.store_address && (
                    <div className="flex gap-2">
                        <MapPinHouse />
                        {displayUser.profile.store_address}
                    </div>
                )}
            </footer>
        </div>
    );
}
