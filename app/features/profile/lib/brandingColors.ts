// lib/brandingColors.ts
import chroma from "chroma-js";

export function generateBrandingColors(hex: string) {
    const base = chroma(hex);

    const text = chroma.contrast(base, "white") >= 4.5 ? "#ffffff" : "#000000";

    return {
        base: base.hex(),
        text,
        muted: base.alpha(0.08).css(),
        border: base.darken(1).hex(),
        hover: base.brighten(0.5).hex(),
    };
}
