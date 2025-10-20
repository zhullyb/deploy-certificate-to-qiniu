import * as qiniu from 'qiniu';
/**
 * CDN 部署结果接口
 */
interface CdnDeployResult {
    /** 状态码 */
    code: number;
    /** 错误信息 (可选) */
    error?: string;
}
/**
 * 构造七牛云 API 请求头
 * @param mac - 七牛云认证对象
 * @param url - API 地址
 * @param method - HTTP 方法
 * @param contentType - Content-Type
 * @param body - 请求体 (可选)
 * @returns 包含认证信息的请求头
 */
export declare function generateQiniuHeaders(mac: qiniu.auth.digest.Mac, url: string, method: string, contentType: string, body?: string): Record<string, string>;
/**
 * 部署证书到七牛云 CDN 域名
 * @param mac - 七牛云认证对象
 * @param certId - 证书 ID
 * @param domain - CDN 域名
 * @returns CDN 部署结果
 * @throws 当 API 请求失败时抛出异常
 */
export declare function deployCertToCDN(mac: qiniu.auth.digest.Mac, certId: string, domain: string): Promise<CdnDeployResult>;
export {};
