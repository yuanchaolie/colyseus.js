// colyseus.js@0.16.22
import { AbortError, ServerError } from './errors/Errors.mjs';
import * as httpie from '@colyseus/httpie';

class HTTP {
    client;
    headers;
    authToken;
    constructor(client, headers = {}) {
        this.client = client;
        this.headers = headers;
    }
    get(path, options = {}) {
        return this.request("get", path, options);
    }
    post(path, options = {}) {
        return this.request("post", path, options);
    }
    del(path, options = {}) {
        return this.request("del", path, options);
    }
    put(path, options = {}) {
        return this.request("put", path, options);
    }
    request(method, path, options = {}) {
        return httpie[method](this.client['getHttpEndpoint'](path), this.getOptions(options)).catch((e) => {
            if (e.aborted) {
                throw new AbortError("Request aborted");
            }
            const status = e.statusCode; //  || -1
            const message = e.data?.error || e.statusMessage || e.message; //  || "offline"
            if (!status && !message) {
                throw e;
            }
            throw new ServerError(status, message);
        });
    }
    request(method, path, options = {}) {
        if (typeof (wx) !== 'undefined' && wx.connectSocket) {
            const wxOptions = this.getWxOptions(method, path, options);
            return new Promise((resolve, reject) => {
                wx.request({
                    ...wxOptions,
                    data: options.body || options.data,
                    success: (res) => {
                        console.log(res);
                        resolve(res);
                    },
                    fail: (err) => {
                        reject(new Errors.ServerError(err.statusCode || -1, err.errMsg));
                    }
                });
            });
        }
        else {
            return httpie[method](this.client['getHttpEndpoint'](path), this.getOptions(options)).catch((e) => {
                if (e.aborted) {
                    throw new AbortError("Request aborted");
                }
                const status = e.statusCode; //  || -1
                const message = e.data?.error || e.statusMessage || e.message; //  || "offline"
                if (!status && !message) {
                    throw e;
                }
                throw new ServerError(status, message);
            });
        }
    }
    getWxOptions(method, path, options) {
        // 合并配置
        const mergedOptions = {
            ...options,
            headers: {
                ...this.headers,
                ...(options.headers || {})
            }
        };
        // 添加认证令牌
        if (this.authToken) {
            mergedOptions.headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        // 返回微信小程序支持的格式
        return {
            url: this.client['getHttpEndpoint'](path),
            method: method,
            data: mergedOptions.body || mergedOptions.data,
            header: mergedOptions.headers,
            timeout: mergedOptions.timeout,
            dataType: 'json'
        };
    }
    getOptions(options) {
        // merge default custom headers with user headers
        options.headers = Object.assign({}, this.headers, options.headers);
        if (this.authToken) {
            options.headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        if (typeof (cc) !== 'undefined' && cc.sys && cc.sys.isNative) ;
        else {
            // always include credentials
            options.withCredentials = true;
        }
        return options;
    }
}

export { HTTP };
//# sourceMappingURL=HTTP.mjs.map
