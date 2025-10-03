"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const qiniu_1 = require("./qiniu");
const fs_1 = __importDefault(require("fs"));
async function run() {
    const accessKey = process.env.INPUT_ACCESS_KEY || '';
    const secretKey = process.env.INPUT_SECRET_KEY || '';
    let cert = process.env.INPUT_CERT || '';
    let key = process.env.INPUT_KEY || '';
    const certName = process.env.INPUT_CERT_NAME || '';
    // 如果 cert/key 是文件路径，则读取内容
    if (cert && fs_1.default.existsSync(cert) && fs_1.default.statSync(cert).isFile()) {
        cert = fs_1.default.readFileSync(cert, 'utf8');
    }
    if (key && fs_1.default.existsSync(key) && fs_1.default.statSync(key).isFile()) {
        key = fs_1.default.readFileSync(key, 'utf8');
    }
    if (!accessKey || !secretKey || !cert || !key || !certName) {
        console.error('参数缺失');
        process.exit(1);
    }
    try {
        const result = await (0, qiniu_1.uploadCertificate)({ accessKey, secretKey, cert, key, certName });
        console.log('上传成功:', result);
    }
    catch (err) {
        console.error('上传失败:', err);
        process.exit(1);
    }
}
run();
