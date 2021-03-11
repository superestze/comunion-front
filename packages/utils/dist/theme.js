"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDarkMode = exports.HTML_DARK_CLASS = exports.watchMediaDarkMode = exports.isMediaDarkMode = void 0;
/**
 * @returns Get system's setting is dark mode
 */
function isMediaDarkMode() {
    return window.matchMedia?.('prefers-color-scheme: dark)').matches || false;
}
exports.isMediaDarkMode = isMediaDarkMode;
/**
 * Watch for dark mode changed
 * @param callback Function to call when dark mode changed
 */
function watchMediaDarkMode(callback) {
    const mediaQueryList = window.matchMedia?.('prefers-color-scheme: dark)');
    const changeEventHandler = (e) => {
        callback(e.matches);
    };
    mediaQueryList?.addEventListener('change', changeEventHandler);
    return () => mediaQueryList?.removeEventListener('change', changeEventHandler);
}
exports.watchMediaDarkMode = watchMediaDarkMode;
/**
 * tailwindcss dark mode class
 */
exports.HTML_DARK_CLASS = 'dark';
/**
 * Set dark mode or not
 * @param isDarkMode target mode is dark?
 */
function setDarkMode(isDarkMode) {
    const classes = document.documentElement.classList;
    if (isDarkMode) {
        if (!classes.contains(exports.HTML_DARK_CLASS)) {
            classes.add(exports.HTML_DARK_CLASS);
        }
    }
    else {
        if (classes.contains(exports.HTML_DARK_CLASS)) {
            classes.remove(exports.HTML_DARK_CLASS);
        }
    }
}
exports.setDarkMode = setDarkMode;
