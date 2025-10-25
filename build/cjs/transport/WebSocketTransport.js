// colyseus.js@0.16.22
'use strict';

var NodeWebSocket = require('ws');

const WebSocket1 = globalThis.WebSocket || NodeWebSocket;
class WebSocketTransport {
    constructor(events) {
        this.events = events;
    }
    send(data) {
        this.ws.send(data);
    }
    sendUnreliable(data) {
        console.warn("colyseus.js: The WebSocket transport does not support unreliable messages");
    }
    /**
     * @param url URL to connect to
     * @param headers custom headers to send with the connection (only supported in Node.js. Web Browsers do not allow setting custom headers)
     */
    connect(url, headers) {
        if (typeof wx !== 'undefined' && wx.connectSocket) {
            // 微信小程序环境
            this.ws = wx.connectSocket({ url, headers, protocols: this.protocols });
            this.ws.onOpen(() => {
                var _a, _b;
                console.log("ws onOpen");
                (_b = (_a = this.events).onopen) === null || _b === void 0 ? void 0 : _b.call(_a); // 直接调用，不返回
            });
            this.ws.onMessage((res) => {
                var _a, _b;
                console.log("wx onMessage", res);
                (_b = (_a = this.events).onmessage) === null || _b === void 0 ? void 0 : _b.call(_a, { data: res.data }); // 包装为标准格式
            });
            this.ws.onClose(() => {
                var _a, _b;
                console.log("wx onClose");
                (_b = (_a = this.events).onclose) === null || _b === void 0 ? void 0 : _b.call(_a);
            });
            this.ws.onError((err) => {
                var _a, _b;
                console.log("wx onError", err);
                (_b = (_a = this.events).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, err);
            });
        }
        else {
            // 非微信环境（Node.js 或浏览器）
            try {
                this.ws = new WebSocket1(url, { headers, protocols: this.protocols });
            }
            catch (e) {
                this.ws = new WebSocket1(url, this.protocols);
            }
            this.ws.binaryType = 'arraybuffer';
            this.ws.onopen = this.events.onopen;
            this.ws.onmessage = this.events.onmessage;
            this.ws.onclose = this.events.onclose;
            this.ws.onerror = this.events.onerror;
        }
    }
    close(code, reason) {
        this.ws.close(code, reason);
    }
    get isOpen() {
        return this.ws.readyState === WebSocket.OPEN;
    }
}

exports.WebSocketTransport = WebSocketTransport;
//# sourceMappingURL=WebSocketTransport.js.map
