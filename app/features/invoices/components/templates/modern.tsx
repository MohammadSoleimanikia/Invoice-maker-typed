import { Instagram, MapPinHouse, PhoneCall } from "lucide-react";

import type { User } from "@/features/auth/types/user.type";
import type { InvoiceViewModel } from "@/features/invoices/types/invoicePreview.type";
import { useProfile } from "@/features/profile/hooks/useProfile";
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
import { generateBrandingColors } from "@/lib/brandingColors";
import { buildLogoUrl, phoneFormatter } from "@/lib/utils";
type invoiceProps = {
    invoice: InvoiceViewModel;
    user: User | null;
};

export default function Modern({ invoice, user }: invoiceProps) {
    const { data: profile } = useProfile();

    // Use passed user for public invoices, fallback to authenticated user profile
    const displayUser = user || profile;
    const colors = displayUser
        ? generateBrandingColors(displayUser.profile.hexcolor)
        : null;
    const brandingLogo = displayUser?.profile.logo;
    return (
        <div className="w-[210mm] min-h-[297mm] shrink-0 mx-auto bg-white dark:bg-muted  print:dark:bg-white  flex print:page-break-inside-avoid">
            <section className=" w-9/12 p-5 flex flex-col justify-between">
                <div>
                    <p className="flex gap-5 items-center w-fit mb-10 ">
                        <span className="font-semibold">شماره فاکتور:</span>
                        <span
                            className="p-1 text-center print:bg-gray-200 print:text-black"
                            style={{
                                backgroundColor: colors?.hover,
                                color: colors?.text,
                            }}
                        >
                            {invoice.invoiceNumber}
                        </span>
                    </p>
                    <p className="mb-10 flex gap-5">
                        <span className="font-semibold">تاریخ ایجاد: </span>
                        <span>{invoice.createdAt}</span>
                    </p>
                    <Table className="w-full border-collapse border border-gray-300">
                        <TableHeader>
                            <TableRow
                                style={{
                                    backgroundColor: colors?.hover,
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
                    <div className="mt-5">
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
                        <p className="mt-5">
                            {" "}
                            <span className="font-semibold">وضعیت: </span>{" "}
                            <span>{invoice.statusText}</span>{" "}
                        </p>{" "}
                        <p>
                            {" "}
                            <span className="font-semibold">
                                روش پرداخت:{" "}
                            </span>{" "}
                            <span>{invoice.paymentText}</span>{" "}
                        </p>
                    </div>
                    {invoice.descriptions !== "" && (
                        <div className="mt-5 border-2 border-dashed bg-slate-200  dark:bg-slate-700 print:dark:bg-slate-200 p-3">
                            <span className="font-semibold ">توضیحات: </span>
                            {invoice.descriptions}
                        </div>
                    )}
                </div>
                <footer className="mt-auto border-t-2 border-slate-300 text-sm pt-2 flex gap-5 justify-around">
                    {displayUser?.profile.insta_link && (
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
                    {displayUser?.profile.store_address && (
                        <div className="flex gap-2">
                            <MapPinHouse />
                            {displayUser.profile.store_address}
                        </div>
                    )}
                </footer>
            </section>

            <section
                style={{
                    backgroundColor: colors?.base,
                    color: colors?.text,
                    borderColor: colors?.border,
                }}
                className=" w-3/12 p-2 flex flex-col justify-between print:bg-transparent print:text-black"
            >
                <div className="mt-4 space-y-20">
                    <div className="flex flex-col items-center">
                        <p className="text-2xl text-center font-bold">
                            <span>{invoice.title}</span>
                        </p>
                        {brandingLogo ? (
                            <img
                                src={
                                    buildLogoUrl(
                                        displayUser?.profile.logo || "",
                                    ) || ""
                                }
                                alt="Logo"
                                className="w-36"
                            />
                        ) : (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-center items-center text-slate-300 font-semibold size-32 border-2 border-dashed">
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

                    <div className="mt-10 space-y-2">
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
                            <span className="font-semibold">تلفن: </span>
                            <span>{invoice.customer.phone}</span>
                        </p>
                    </div>
                </div>
                <div className="mb-5 text-sm"></div>
            </section>
        </div>
    );
}
