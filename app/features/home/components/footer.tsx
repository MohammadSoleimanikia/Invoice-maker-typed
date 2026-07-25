import { Link } from "react-router";

// Footer
export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="/logo.svg"
                                className="h-8 w-auto"
                                alt="وب فاکتور"
                            />
                            <span className="text-white font-bold text-lg">
                                وب فاکتور
                            </span>
                        </div>
                        <p className="text-sm">
                            سامانه صدور فاکتور، مدیریت فروش و مشتریان
                        </p>
                        <div className="mt-4 text-xs">
                            © ۱۴۰۵ وب فاکتور. تمام حقوق محفوظ است.
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            دسترسی سریع
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-white transition"
                                >
                                    صفحه اصلی
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="hover:text-white transition"
                                >
                                    پنل کاربری
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/demo"
                                    className="hover:text-white transition"
                                >
                                    ساخت رایگان فاکتور
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            تماس با ما
                        </h4>

                        <div className="space-y-2">
                            <ul className="flex gap-1.5 items-center space-y-2 text-sm">
                                <li>
                                    <a
                                        href="https://t.me/webfactor_ir"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        کانال تلگرام
                                    </a>
                                </li>
                            </ul>
                            <ul className="flex gap-1.5 items-center space-y-2 text-sm">
                                <li>
                                    <a
                                        href="https://ble.ir/webfactor"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        کانال بله
                                    </a>
                                </li>
                            </ul>
                            <ul className="flex gap-1.5 items-center space-y-2 text-sm">
                                فارس - شهرستان : مهر - بخش : گله دار - شهر : گله
                                دار - محله : میدان امام - کوچه ((محمد قاسمی))
                            </ul>
                            <ul className="flex gap-1.5 items-center space-y-2 text-sm">
                                <li>تلفن: 09387051245</li>
                            </ul>
                        </div>
                    </div>

                    <a
                        referrerPolicy="origin"
                        target="_blank"
                        href="https://trustseal.enamad.ir/?id=738212&Code=f59JgfLw0MEjq7k3k5J2g7GFncU5fg28"
                    >
                        <img
                            referrerPolicy="origin"
                            src="https://trustseal.enamad.ir/logo.aspx?id=738212&Code=f59JgfLw0MEjq7k3k5J2g7GFncU5fg28"
                            alt="نماد اعتماد الکترونیکی"
                            style={{ cursor: "pointer" }}
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
