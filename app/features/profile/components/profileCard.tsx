// features/profile/components/ProfileCard.tsx
import {
    CreditCard,
    Edit,
    Instagram,
    LayoutTemplate,
    MapPin,
    Package,
    Phone,
    Store,
    User,
} from "lucide-react";
import { useState } from "react";

import {
    invoiceTemplateFa,
    normalizeInvoiceTemplate,
} from "@/features/invoices/types/template";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Button } from "@/features/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/features/shared/components/ui/card";
import { Separator } from "@/features/shared/components/ui/separator";
import { formatPhoneNumber } from "@/features/shared/lib/phoneUtils";
import { buildLogoUrl } from "@/features/shared/lib/utils";

import LoadingSpinner from "../../shared/components/ui/loadingSpinner";
import EditProfileModal from "./editProfileModal";

export default function ProfileCard() {
    const { data: profile, isLoading } = useProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (isLoading) return <LoadingSpinner />;
    if (!profile) return <p>پروفایل پیدا نشد</p>;
    const InfoRow = ({
        icon: Icon,
        label,
        value,
    }: {
        icon: any;
        label: string;
        value: string;
    }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="mt-0.5">
                <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value || "-"}</p>
            </div>
        </div>
    );

    return (
        <>
            <Card className="overflow-hidden border-0 shadow-lg">
                <CardHeader className="relative pt-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-end gap-4">
                            {profile.profile.logo ? (
                                <div className="relative -mt-8">
                                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-lg flex items-center justify-center">
                                        <img
                                            src={
                                                buildLogoUrl(
                                                    profile.profile.logo,
                                                ) || ""
                                            }
                                            alt="Logo"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative -mt-8">
                                    <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg">
                                        <Store className="w-10 h-10 text-primary" />
                                    </div>
                                </div>
                            )}
                            <div className="mt-2">
                                <CardTitle className="text-xl">
                                    {profile.first_name} {profile.last_name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3" />
                                    {formatPhoneNumber(profile.phone_number)}
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditModalOpen(true)}
                            className="gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            ویرایش پروفایل
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* اطلاعات فروشگاه */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Store className="w-5 h-5 text-primary" />
                            اطلاعات فروشگاه
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <InfoRow
                                icon={Store}
                                label="نام فروشگاه"
                                value={profile.profile.store_name || "ثبت نشده"}
                            />
                            <InfoRow
                                icon={MapPin}
                                label="آدرس فروشگاه"
                                value={
                                    profile.profile.store_address || "ثبت نشده"
                                }
                            />
                            <InfoRow
                                icon={CreditCard}
                                label="توضیحات پرداخت فاکتور"
                                value={
                                    profile.profile.payment_description ||
                                    "ثبت نشده"
                                }
                            />
                            <InfoRow
                                icon={LayoutTemplate}
                                label="قالب پیش‌فرض فاکتور"
                                value={
                                    invoiceTemplateFa[
                                        normalizeInvoiceTemplate(
                                            profile.profile
                                                .default_invoice_template,
                                        )
                                    ]
                                }
                            />
                            <InfoRow
                                icon={Instagram}
                                label="اینستاگرام"
                                value={profile.profile.insta_link || "ثبت نشده"}
                            />
                            <InfoRow
                                icon={Package}
                                label="توضیحات فروشگاه"
                                value={
                                    profile.profile.store_description ||
                                    "ثبت نشده"
                                }
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* اطلاعات شخصی */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            اطلاعات شخصی
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <InfoRow
                                icon={User}
                                label="نام کامل"
                                value={`${profile.first_name} ${profile.last_name || ""}`}
                            />
                            <InfoRow
                                icon={Phone}
                                label="شماره تماس"
                                value={
                                    formatPhoneNumber(profile.phone_number) ||
                                    "ثبت نشده"
                                }
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* برندینگ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <div
                                className="w-5 h-5 rounded-full"
                                style={{
                                    backgroundColor: profile.profile.hexcolor,
                                }}
                            />
                            برندینگ
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <InfoRow
                                icon={Store}
                                label="نام فروشگاه"
                                value={profile.profile.store_name || "ثبت نشده"}
                            />
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="mt-0.5">
                                    <div
                                        className="w-5 h-5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                profile.profile.hexcolor,
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        رنگ برند
                                    </p>
                                    <p className="font-medium">
                                        {profile.profile.hexcolor}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-muted/30 text-sm text-muted-foreground">
                    <span>{" عضویت از:  "}</span> {profile.date_joined}
                </CardFooter>
            </Card>

            <EditProfileModal
                profile={profile}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />
        </>
    );
}
