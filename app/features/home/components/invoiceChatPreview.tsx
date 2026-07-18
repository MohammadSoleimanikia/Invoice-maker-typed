import { ExternalLink, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            {[0, 1, 2].map((index) => (
                <span
                    key={index}
                    className="size-2 rounded-full bg-primary"
                    style={{
                        animation: "chatBounce 1.2s ease-in-out infinite",
                        animationDelay: `${index * 0.2}s`,
                    }}
                />
            ))}
        </div>
    );
}

function InvoiceLinkCard() {
    return (
        <Link
            to="/login"
            className="mt-2 flex items-center gap-3 rounded-xl border border-white/30 bg-white/20 px-3 py-2.5 no-underline transition hover:bg-white/30"
        >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/25">
                <ExternalLink className="size-4 text-white" />
            </div>

            <div className="min-w-0 text-right">
                <p className="text-sm font-semibold text-white">
                    مشاهده فاکتور
                </p>

                <p dir="ltr" className="mt-0.5 truncate text-xs text-white/70">
                    webfactor.ir/invoice/12345
                </p>
            </div>
        </Link>
    );
}

export function InvoiceChatPreview() {
    const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
    const [showTyping, setShowTyping] = useState(false);

    useEffect(() => {
        const timers = [
            window.setTimeout(
                () => setVisibleMessages((items) => [...items, 1]),
                200,
            ),

            window.setTimeout(() => setShowTyping(true), 1000),

            window.setTimeout(() => setShowTyping(false), 1900),

            window.setTimeout(
                () => setVisibleMessages((items) => [...items, 2]),
                2000,
            ),

            window.setTimeout(
                () => setVisibleMessages((items) => [...items, 3]),
                2700,
            ),

            window.setTimeout(
                () => setVisibleMessages((items) => [...items, 4]),
                3900,
            ),
        ];

        return () => {
            timers.forEach(window.clearTimeout);
        };
    }, []);

    return (
        <div className="relative mx-auto w-full max-w-[420px]">
            <style>{`
                @keyframes chatBounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.5;
                    }

                    30% {
                        transform: translateY(-5px);
                        opacity: 1;
                    }
                }

                @keyframes chatMessageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .chat-message-enter {
                    animation: chatMessageEnter 0.32s
                        cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>

            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-primary/20 blur-3xl" />

            <div className="flex h-[430px] sm:h-[460px] w-full flex-col overflow-hidden rounded-[2rem] border bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900">
                {/*header of conversation*/}
                <div className="flex items-center gap-3 bg-gradient-to-l from-primary to-accent px-5 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                        و
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-white">
                            پشتیبانی وب فاکتور
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-green-300" />
                            <span className="text-xs text-white/75">
                                آنلاین
                            </span>
                        </div>
                    </div>
                </div>

                {/* messages */}
                <div className="flex flex-1 flex-col gap-4 bg-gray-50 px-4 py-5 dark:bg-gray-950">
                    {visibleMessages.includes(1) && (
                        <div className="chat-message-enter flex flex-col items-start gap-1">
                            <div className="max-w-[280px] rounded-[18px_18px_18px_4px] bg-white px-4 py-2.5 text-sm leading-7 text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-100">
                                سلام، میشه لینک فاکتور رو برام بفرستید؟
                            </div>

                            <span className="mr-1 text-xs text-gray-400">
                                ۱۴:۴۱
                            </span>
                        </div>
                    )}

                    {showTyping && (
                        <div className="chat-message-enter flex items-start">
                            <div className="rounded-[18px_18px_18px_4px] bg-white shadow-sm dark:bg-gray-800">
                                <TypingDots />
                            </div>
                        </div>
                    )}

                    {visibleMessages.includes(2) && (
                        <div className="chat-message-enter flex flex-col items-end gap-1">
                            <div className="max-w-[280px] rounded-[18px_18px_4px_18px] bg-gradient-to-l from-primary to-accent px-4 py-2.5 text-sm leading-7 text-white shadow-lg">
                                حتماً، این هم لینک فاکتور شما 😊
                            </div>

                            <span className="ml-1 text-xs text-gray-400">
                                ۱۴:۴۲
                            </span>
                        </div>
                    )}

                    {visibleMessages.includes(3) && (
                        <div className="chat-message-enter flex flex-col items-end gap-1">
                            <div className="w-full max-w-[280px] rounded-[18px_18px_4px_18px] bg-gradient-to-l from-primary to-accent px-4 py-3 shadow-lg">
                                <InvoiceLinkCard />
                            </div>

                            <span className="ml-1 text-xs text-gray-400">
                                ۱۴:۴۲
                            </span>
                        </div>
                    )}

                    {visibleMessages.includes(4) && (
                        <div className="chat-message-enter flex flex-col items-start gap-1">
                            <div className="max-w-[280px] rounded-[18px_18px_18px_4px] bg-white px-4 py-2.5 text-sm leading-7 text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-100">
                                دریافت شد، ممنونم 👍
                            </div>

                            <span className="mr-1 text-xs text-gray-400">
                                ۱۴:۴۳
                            </span>
                        </div>
                    )}
                </div>

                {/*messages field*/}
                <div className="flex items-center gap-3 border-t bg-white px-4 py-3.5 dark:border-white/10 dark:bg-gray-900">
                    <div className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-gray-400 dark:bg-gray-800">
                        پیام خود را بنویسید…
                    </div>

                    <button
                        type="button"
                        aria-label="ارسال پیام"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                    >
                        <Send className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
