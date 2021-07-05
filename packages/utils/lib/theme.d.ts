/**
 * @returns Get system's setting is dark mode
 */
export declare function isMediaDarkMode(): boolean;
/**
 * Watch for dark mode changed
 * @param callback Function to call when dark mode changed
 */
export declare function watchMediaDarkMode(callback: (isDarkMode: boolean) => void): () => void;
/**
 * tailwindcss dark mode class
 */
export declare const HTML_DARK_CLASS = "dark";
/**
 * Set dark mode or not
 * @param isDarkMode target mode is dark?
 */
export declare function setDarkMode(isDarkMode: boolean): void;
//# sourceMappingURL=theme.d.ts.map