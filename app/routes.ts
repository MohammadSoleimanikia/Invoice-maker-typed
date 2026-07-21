import {
    index,
    layout,
    route,
    type RouteConfig,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("i/:invoiceToken", "routes/invoices/publicInvoice.tsx"),

    route("payment/result", "routes/payment/result.tsx"),

    // The local demo must stay outside GuestOnly because GuestOnly calls
    // /account/profile/ to determine authentication state.
    route("demo", "routes/demoInvoice.tsx"),
    route("demo-invoice/preview", "routes/demoInvoicePreview.tsx"),

    layout("routes/guestOnly.tsx", [
        route("login", "routes/logIn.tsx"),
    ]),

    layout("routes/dashboard/protected.tsx", [
        layout("routes/dashboard/dashboardLayout.tsx", [
            route("subscription", "routes/dashboard/subscription.tsx"),
            route("dashboard", "routes/dashboard/dashboard.tsx"),

            route("products", "routes/products.tsx"),

            route("invoices", "routes/invoices/invoices.tsx"),
            route("invoices/new", "routes/invoices/newInvoice.tsx"),
            route("invoices/edit/:id", "routes/invoices/editInvoice.tsx"),
            route("invoices/:id", "routes/invoices/invoice.tsx"),

            route("profile", "routes/profile.tsx"),

            route("customers", "routes/customers.tsx"),
            route(
                "customers/:id/reports",
                "routes/customers/customerReports.tsx",
            ),

            route("categories", "routes/categories.tsx"),

            route("purchase-invoices", "routes/purchaseInvoices.tsx"),
            route("purchase-invoices/new", "routes/purchaseInvoicesNew.tsx"),
            route(
                "purchase-invoices/edit/:id",
                "routes/purchaseInvoicesEdit.tsx",
            ),
            route("purchase-invoices/:id", "routes/purchaseInvoicesId.tsx"),
        ]),
    ]),

    route("*", "routes/NotFound.tsx"),
] satisfies RouteConfig;
