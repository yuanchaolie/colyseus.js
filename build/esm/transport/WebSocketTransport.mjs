// colyseus.js@0.16.22
import NodeWebSocket from 'ws';

const WebSocket1 = globalThis.WebSocket || NodeWebSocket;
class WebSocketTransport {
    events;
    ws;
    protocols;
    constructor(events) {
        this.events = events;
    }
    send(data) {
        if (typeof wx !== 'undefined' && wx.connectSocket) {
            this.ws.send({
                data: data,
            });
        }
        else {
            this.ws.send(data);
        }
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
                console.log("ws onOpen");
                this.events.onopen?.(); // 直接调用，不返回
            });
            this.ws.onMessage((res) => {
                console.log("wx onMessage", res);
                this.events.onmessage?.({ data: res.data }); // 包装为标准格式
            });
            this.ws.onClose(() => {
                console.log("wx onClose");
                this.events.onclose?.();
            });
            this.ws.onError((err) => {
                console.log("wx onError", err);
                this.events.onerror?.(err);
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

export { WebSocketTransport };
//# sourceMappingURL=WebSocketTransport.mjs.map
