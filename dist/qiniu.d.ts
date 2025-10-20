/**
 * 证书上传参数接口
 */
interface UploadParams {
    /** 七牛云 Access Key */
    accessKey: string;
    /** 七牛云 Secret Key */
    secretKey: string;
    /** SSL 证书内容 (PEM 格式) */
    cert: string;
    /** SSL 证书私钥内容 (PEM 格式) */
    key: string;
    /** 证书名称 */
    certName: string;
    /** 是否自动部署到 CDN (默认: true) */
    deployToCDN?: boolean;
    /** CDN 域名 (当 deployToCDN 为 true 时必填) */
    certDomain?: string;
}
/**
 * 证书上传结果接口
 */
interface UploadResult {
    /** 状态码 */
    code: number;
    /** 错误信息 */
    error: string;
    /** 证书 ID */
    certID?: string;
    /** CDN 部署结果 (仅当 deployToCDN 为 true 时存在) */
    cdnDeploy?: any;
}
/**
 * 上传证书到七牛云
 * @param params - 上传参数
 * @returns 上传结果，包含证书 ID 和 CDN 部署结果（如果启用）
 * @throws 当上传失败或 API 返回错误时抛出异常
 */
export declare function uploadCertificate(params: UploadParams): Promise<UploadResult>;
export {};
