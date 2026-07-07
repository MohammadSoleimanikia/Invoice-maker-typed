/**
 * Format Persian/Jalali date from API
 * Input: "1404-11-26 20:39:08"
 * Output: "20:39:08 26-11-1404"
 */
export function formatPersianDateTime(
    dateString: string | null | undefined,
): string {
    if (!dateString) return "";

    try {
        // Split date and time
        const [datePart, timePart] = dateString.split(" ");

        if (!datePart) return "";

        // Parse date parts (YYYY-MM-DD format)
        const [year, month, day] = datePart.split("-");

        // Format as: time DD-MM-YYYY
        if (timePart) {
            return `${timePart} ${day}-${month}-${year}`;
        }

        // If no time, just format date
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error("Error formatting Persian date:", dateString, error);
        return dateString;
    }
}

/**
 * Format only the date part
 * Input: "1404-11-26 20:39:08"
 * Output: "26-11-1404"
 */
export function formatPersianDate(
    dateString: string | null | undefined,
): string {
    if (!dateString) return "";

    try {
        const datePart = dateString.split(" ")[0];
        const [year, month, day] = datePart.split("-");
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error("Error formatting Persian date:", dateString, error);
        return dateString;
    }
}

/**
 * Format only the time part
 * Input: "1404-11-26 20:39:08"
 * Output: "20:39:08"
 */
export function formatPersianTime(
    dateString: string | null | undefined,
): string {
    if (!dateString) return "";

    try {
        const timePart = dateString.split(" ")[1];
        return timePart || "";
    } catch (error) {
        console.error("Error formatting Persian time:", dateString, error);
        return dateString;
    }
}
