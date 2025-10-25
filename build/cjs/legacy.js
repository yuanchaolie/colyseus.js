// colyseus.js@0.16.22
'use strict';

//
// Polyfills for legacy environments
//
/*
 * Support Android 4.4.x
 */
if (!ArrayBuffer.isView) {
    ArrayBuffer.isView = (a) => {
        return (a !== null &&
            typeof a === "object" &&
            a.buffer instanceof ArrayBuffer);
    };
}
// Define globalThis if not available.
// https://github.com/colyseus/colyseus.js/issues/86
if (typeof globalThis === "undefined" && typeof window !== "undefined") {
    // @ts-ignore
    window["globalThis"] = window;
}
if (typeof globalThis === "undefined") {
    if (typeof global !== "undefined") {
        // Node.js 或微信小程序环境
        globalThis = global;
    }
    else if (typeof window !== "undefined") {
        // 浏览器环境
        globalThis = window;
    }
    else {
        // 其他环境，包括微信小程序
        try {
            globalThis = Function("return this")();
        }
        catch (e) {
            globalThis = {};
        }
    }
}
// Cocos Creator does not provide "FormData"
// Define a dummy implementation so it doesn't crash
if (typeof FormData === "undefined") {
    // @ts-ignore
    globalThis["FormData"] = class {
    };
}
//# sourceMappingURL=legacy.js.map
