import { Instagram, MapPinHouse, PhoneCall } from "lucide-react";

import type { User } from "@/features/auth/types/user.type";
import type { InvoiceViewModel } from "@/features/invoices/types/invoicePreview.type";
import { useProfile } from "@/features/profile/hooks/useProfile";
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

export default function Minimal({ invoice, user }: invoiceProps) {
    const { data: profile } = useProfile();
    // Use passed user prop for public invoices, fallback to authenticated user profile
    const displayUser = user || profile;
    const colors = displayUser
        ? generateBrandingColors(displayUser.profile.hexcolor)
        : null;
    const brandingLogo = displayUser?.profile?.logo;
    return (
        <div className="w-[210mm] min-h-[297mm] mx-auto shrink-0  bg-white dark:bg-muted  print:dark:bg-white p-10 flex flex-col print:page-break-inside-avoid">
            <p className="text-2xl text-center font-bold">
                <span>{invoice.title}</span>
            </p>

            <header className="flex justify-between pb-8">
                <div className="mt-3 space-y-5">
                    <div>
                        <p className="text-2xl  font-bold">
                            <span className="font-semibold">شماره فاکتور:</span>
                            <span>{invoice.invoiceNumber}</span>
                        </p>
                        <p>
                            <span className="font-semibold">تاریخ ایجاد: </span>
                            <span>{invoice.createdAt}</span>
                        </p>
                    </div>
                    <div>
                        <div className="mt-5">
                            <h2 className="font-semibold text-lg">
                                اطلاعات مشتری
                            </h2>
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
                    </div>
                </div>

                {/* branding */}
                <div className="flex flex-col items-center">
                    {brandingLogo ? (
                        <img
                            src={buildLogoUrl(brandingLogo) || ""}
                            alt="Logo"
                            className="w-36 "
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
                    {brandingLogo && displayUser?.profile?.store_name && (
                        <p className="ml-4 text-xl text-nowrap font-light">
                            {displayUser.profile.store_name}
                        </p>
                    )}
                </div>
            </header>
            <hr className="border-t border-gray-300" />
            <section>
                <div className="mt-10">
                    <Table className="w-full border-collapse">
                        <TableHeader>
                            <TableRow
                                style={{
                                    backgroundColor: colors?.base,
                                    color: colors?.text,
                                    borderColor: colors?.border,
                                }}
                                className="border-b border-gray-300 print:bg-gray-200 print:text-black"
                            >
                                <th className=" p-2 text-right">نام محصول</th>
                                <th className="p-2 text-right">تعداد</th>
                                <th className="p-2 text-right">قیمت واحد</th>
                                <th className="p-2 text-right">قیمت کل</th>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border-0 border-b">
                            {invoice.items.map((item, index) => (
                                <TableRow className="border-0" key={index}>
                                    <td className="p-2 text-right">
                                        {item.name}
                                    </td>
                                    <td className="p-2 text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="p-2 text-right">
                                        {item.unitPrice.toLocaleString()}
                                    </td>
                                    <td className="p-2 text-right">
                                        {item.total.toLocaleString()}
                                    </td>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-10 space-y-2">
                    <div
                        style={{
                            borderColor: colors?.base,
                        }}
                        className="border-y-4 border-gray-600 w-fit py-2 print:border-gray-600"
                    >
                        {invoice.added_value > 0 && (
                            <p>
                                <span className="font-semibold pl-2">
                                    مالیات بر ارزش افزوده (۱۰٪):
                                </span>
                                <span>
                                    {invoice.added_value.toLocaleString()} تومان
                                </span>
                            </p>
                        )}
                        {invoice.discount > 0 && (
                            <p>
                                <span className="font-semibold pl-2">
                                    تخفیف:
                                </span>
                                <span>
                                    {invoice.discount.toLocaleString()} تومان
                                </span>
                            </p>
                        )}
                        <p>
                            <span className="font-semibold pl-2">مجموع:</span>
                            <span>{invoice.total.toLocaleString()} تومان</span>
                        </p>
                        <p>
                            <span className="font-semibold pl-2">
                                {" "}
                                مجموع به حروف:
                            </span>
                            <span>{invoice.totalText} تومان</span>
                        </p>
                    </div>
                    <p>
                        <span className="font-semibold">وضعیت: </span>
                        <span>{invoice.statusText}</span>
                    </p>

                    <p>
                        <span className="font-semibold">روش پرداخت: </span>
                        <span>{invoice.paymentText}</span>
                    </p>
                    {invoice.descriptions !== "" && (
                        <div className="mt-5 border-2 border-dashed bg-slate-200  dark:bg-slate-700 print:dark:bg-slate-200 p-3">
                            <span className="font-semibold ">توضیحات: </span>
                            {invoice.descriptions}
                        </div>
                    )}
                </div>
            </section>
            <footer className="mt-auto border-t-2 border-slate-300 text-sm pt-2 flex gap-5 justify-around">
                {displayUser?.profile?.insta_link && (
                    <div className="flex gap-2">
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
                {displayUser?.profile?.store_address && (
                    <div className="flex gap-2">
                        <MapPinHouse />
                        {displayUser.profile.store_address}
                    </div>
                )}
            </footer>
        </div>
    );
}
