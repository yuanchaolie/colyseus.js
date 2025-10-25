// colyseus.js@0.16.22
'use strict';

var Errors$1 = require('./errors/Errors.js');
var httpie = require('@colyseus/httpie');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var httpie__namespace = /*#__PURE__*/_interopNamespaceDefault(httpie);

class HTTP {
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
        return httpie__namespace[method](this.client['getHttpEndpoint'](path), this.getOptions(options)).catch((e) => {
            var _a;
            if (e.aborted) {
                throw new Errors$1.AbortError("Request aborted");
            }
            const status = e.statusCode; //  || -1
            const message = ((_a = e.data) === null || _a === void 0 ? void 0 : _a.error) || e.statusMessage || e.message; //  || "offline"
            if (!status && !message) {
                throw e;
            }
            throw new Errors$1.ServerError(status, message);
        });
    }
    request(method, path, options = {}) {
        if (typeof (wx) !== 'undefined' && wx.connectSocket) {
            const wxOptions = this.getWxOptions(method, path, options);
            return new Promise((resolve, reject) => {
                wx.request(Object.assign(Object.assign({}, wxOptions), { data: options.body || options.data, success: (res) => {
                        console.log(res);
                        resolve(res);
                    }, fail: (err) => {
                        reject(new Errors.ServerError(err.statusCode || -1, err.errMsg));
                    } }));
            });
        }
        else {
            return httpie__namespace[method](this.client['getHttpEndpoint'](path), this.getOptions(options)).catch((e) => {
                var _a;
                if (e.aborted) {
                    throw new Errors$1.AbortError("Request aborted");
                }
                const status = e.statusCode; //  || -1
                const message = ((_a = e.data) === null || _a === void 0 ? void 0 : _a.error) || e.statusMessage || e.message; //  || "offline"
                if (!status && !message) {
                    throw e;
                }
                throw new Errors$1.ServerError(status, message);
            });
        }
    }
    getWxOptions(method, path, options) {
        // 合并配置
        const mergedOptions = Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, this.headers), (options.headers || {})) });
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

exports.HTTP = HTTP;
//# sourceMappingURL=HTTP.js.map
