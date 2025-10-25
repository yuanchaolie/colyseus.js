import NodeWebSocket from "ws";
import { ITransport, ITransportEventMap } from "./ITransport";

const WebSocket = globalThis.WebSocket || NodeWebSocket;

export class WebSocketTransport implements ITransport {
    ws: WebSocket | NodeWebSocket;
    protocols?: string | string[];

    constructor(public events: ITransportEventMap) {}

    public send(data: Buffer | Uint8Array): void {
        this.ws.send(data);
    }

    public sendUnreliable(data: ArrayBuffer | Array<number>): void {
        console.warn("colyseus.js: The WebSocket transport does not support unreliable messages");
    }

    /**
     * @param url URL to connect to
     * @param headers custom headers to send with the connection (only supported in Node.js. Web Browsers do not allow setting custom headers)
     */
    public connect(url: string, headers?: any): void {
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
      } else {
          // 非微信环境（Node.js 或浏览器）
          try {
              this.ws = new WebSocket(url, { headers, protocols: this.protocols });
          } catch (e) {
              this.ws = new WebSocket(url, this.protocols);
          }
          this.ws.binaryType = 'arraybuffer';
          this.ws.onopen = this.events.onopen;
          this.ws.onmessage = this.events.onmessage;
          this.ws.onclose = this.events.onclose;
          this.ws.onerror = this.events.onerror;
      }
    }

    public close(code?: number, reason?: string) {
        this.ws.close(code, reason);
    }

    get isOpen() {
        return this.ws.readyState === WebSocket.OPEN;
    }

}
