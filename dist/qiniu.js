"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCertificate = uploadCertificate;
const qiniu = __importStar(require("qiniu"));
const axios_1 = __importDefault(require("axios"));
const QINIU_API = 'https://api.qiniu.com/sslcert';
async function uploadCertificate(params) {
    const { accessKey, secretKey, cert, key, certName } = params;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const body = {
        name: certName,
        common_name: certName,
        pri: key,
        ca: cert
    };
    const url = QINIU_API;
    const method = 'POST';
    const contentType = 'application/json';
    const accessToken = qiniu.util.generateAccessTokenV2(mac, url, method, contentType, JSON.stringify(body));
    try {
        const resp = await axios_1.default.post(url, body, {
            headers: {
                'Content-Type': contentType,
                'Authorization': accessToken
            }
        });
        return resp.data;
    }
    catch (err) {
        if (err.response) {
            throw new Error(`Qiniu API Error: ${err.response.status} ${JSON.stringify(err.response.data)}`);
        }
        else {
            throw new Error(`Network Error: ${err.message}`);
        }
    }
}
