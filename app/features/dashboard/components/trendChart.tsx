// features/dashboard/components/TrendChart.tsx
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/features/shared/components/ui/card";

import { EmptyChartState } from "./EmptyChartState";

type TrendData = {
    date: string;
    total: number;
};

type JalaliDateParts = {
    year: number;
    month: number;
    day: number;
};

function parseJalaliDate(value: string): JalaliDateParts {
    const normalized = value.trim().replaceAll("-", "/");
    const [year, month, day] = normalized.split("/").map(Number);

    return {
        year,
        month,
        day,
    };
}

function formatJalaliDate({ year, month, day }: JalaliDateParts) {
    return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(
        2,
        "0",
    )}`;
}

function getJalaliMonthLength(year: number, month: number) {
    if (month >= 1 && month <= 6) return 31;
    if (month >= 7 && month <= 11) return 30;

    return isJalaliLeapYear(year) ? 30 : 29;
}

function isJalaliLeapYear(year: number) {
    const mod = year % 33;

    return [1, 5, 9, 13, 17, 22, 26, 30].includes(mod);
}

function subtractOneJalaliDay(value: string) {
    const date = parseJalaliDate(value);

    date.day -= 1;

    if (date.day >= 1) {
        return formatJalaliDate(date);
    }

    date.month -= 1;

    if (date.month < 1) {
        date.year -= 1;
        date.month = 12;
    }

    date.day = getJalaliMonthLength(date.year, date.month);

    return formatJalaliDate(date);
}

function getJalaliSortValue(value: string) {
    const { year, month, day } = parseJalaliDate(value);

    return year * 10000 + month * 100 + day;
}

function formatJalaliShortLabel(value: string) {
    const { month, day } = parseJalaliDate(value);

    return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
}

export function TrendChart({ chartData }: { chartData: TrendData[] }) {
    const hasData = chartData?.length > 0;
    const hasRealData = chartData?.some((d) => d.total > 0);

    if (!hasData) {
        return (
            <EmptyChartState
                title="ترند فروش"
                message="داده‌ای برای نمایش وجود ندارد"
                hint="پس از ثبت فاکتورها، ترند فروش اینجا نمایش داده می‌شود"
            />
        );
    }

    if (!hasRealData) {
        return (
            <EmptyChartState
                title="ترند فروش"
                message="هیچ فروشی ثبت نشده است"
                hint="پس از اولین فروش، نمودار اینجا نمایش داده می‌شود"
            />
        );
    }

    let processedData = [...chartData].sort((a, b) => {
        return getJalaliSortValue(a.date) - getJalaliSortValue(b.date);
    });

    if (processedData.length === 1) {
        processedData = [
            {
                date: subtractOneJalaliDay(processedData[0].date),
                total: 0,
            },
            ...processedData,
        ];
    }

    const maxTotal = Math.max(...processedData.map((d) => d.total));
    const maxValue = Math.ceil(maxTotal * 1.2);
    const minValue = 0;

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    ترند فروش
                </CardTitle>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={processedData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="rgb(55 65 81 / 0.5)"
                        />

                        <XAxis
                            dataKey="date"
                            tickFormatter={(value: string) =>
                                formatJalaliShortLabel(value)
                            }
                            tick={{
                                fontSize: 12,
                                fill: "rgb(148 163 184)",
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[minValue, maxValue]}
                            tick={{
                                fontSize: 12,
                                fill: "rgb(148 163 184)",
                            }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) =>
                                value >= 1000000
                                    ? `${(value / 1000000).toFixed(1)}M`
                                    : value >= 1000
                                      ? `${(value / 1000).toFixed(0)}K`
                                      : value.toString()
                            }
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgb(30 41 59)",
                                borderRadius: "8px",
                                border: "1px solid rgb(55 65 81)",
                                fontSize: "12px",
                                color: "rgb(226 232 240)",
                            }}
                            labelFormatter={(label) =>
                                `تاریخ: ${String(label)}`
                            }
                            formatter={(value: number) => [
                                value.toLocaleString("fa-IR"),
                                "فروش",
                            ]}
                        />

                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#14b8a6"
                            strokeWidth={2}
                            dot={
                                processedData.length > 2
                                    ? { r: 3, fill: "#14b8a6" }
                                    : false
                            }
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>

                <p className="text-center mt-3 text-sm text-muted-foreground">
                    ترند فروش هفتگی
                </p>
            </CardContent>
        </Card>
    );
}
