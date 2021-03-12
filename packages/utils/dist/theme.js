"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDarkMode = exports.HTML_DARK_CLASS = exports.watchMediaDarkMode = exports.isMediaDarkMode = void 0;
/**
 * @returns Get system's setting is dark mode
 */
function isMediaDarkMode() {
    var _a;
    return ((_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, 'prefers-color-scheme: dark)').matches) || false;
}
exports.isMediaDarkMode = isMediaDarkMode;
/**
 * Watch for dark mode changed
 * @param callback Function to call when dark mode changed
 */
function watchMediaDarkMode(callback) {
    var _a;
    var mediaQueryList = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, 'prefers-color-scheme: dark)');
    var changeEventHandler = function (e) {
        callback(e.matches);
    };
    mediaQueryList === null || mediaQueryList === void 0 ? void 0 : mediaQueryList.addEventListener('change', changeEventHandler);
    return function () { return mediaQueryList === null || mediaQueryList === void 0 ? void 0 : mediaQueryList.removeEventListener('change', changeEventHandler); };
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
    var classes = document.documentElement.classList;
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
