export function formatPhoneNumber(phone: string | undefined): string {
    if (!phone) return "-";
    
    // حذف فاصله‌ها و کاراکترهای اضافی
    let cleaned = phone.replace(/\s/g, "");
    
    // تبدیل +98 به 0
    if (cleaned.startsWith("+98")) {
        cleaned = "0" + cleaned.slice(3);
    }
    // تبدیل 0098 به 0
    else if (cleaned.startsWith("0098")) {
        cleaned = "0" + cleaned.slice(4);
    }
    // اگر با 98 شروع شده و 11 رقمی نیست
    else if (cleaned.startsWith("98") && cleaned.length === 11) {
        cleaned = "0" + cleaned.slice(2);
    }
    
    return cleaned;
}