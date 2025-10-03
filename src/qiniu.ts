import * as qiniu from 'qiniu';
import axios, { AxiosError } from 'axios';
import { deployCertToCDN } from './utils';

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

/** 七牛云证书管理 API 地址 */
const QINIU_API = 'https://api.qiniu.com/sslcert';

/**
 * 上传证书到七牛云
 * @param params - 上传参数
 * @returns 上传结果，包含证书 ID 和 CDN 部署结果（如果启用）
 * @throws 当上传失败或 API 返回错误时抛出异常
 */
export async function uploadCertificate(params: UploadParams): Promise<UploadResult> {
  const {
    accessKey,
    secretKey,
    cert,
    key,
    certName,
    deployToCDN = true,
    certDomain
  } = params;

  // 创建七牛云认证对象
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

  // 构造请求体
  const body = {
    name: certName,
    common_name: certName,
    pri: key,
    ca: cert
  };

  const method = 'POST';
  const contentType = 'application/json';
  const accessToken = qiniu.util.generateAccessTokenV2(
    mac,
    QINIU_API,
    method,
    contentType,
    JSON.stringify(body)
  );

  try {
    console.log('[Qiniu] 开始上传证书到七牛云');

    const resp = await axios.post(QINIU_API, body, {
      headers: {
        'Content-Type': contentType,
        'Authorization': accessToken
      }
    });

    const result: UploadResult = resp.data;
    console.log('[Qiniu] 证书上传结果:', result);

    // 自动部署到 CDN
    if (deployToCDN && result.certID && certDomain) {
      console.log(`[Qiniu] 自动部署证书到 CDN 域名: ${certDomain}`);
      result.cdnDeploy = await deployCertToCDN(mac, result.certID, certDomain);
      console.log('[Qiniu] CDN 部署结果:', result.cdnDeploy);
    }

    return result;
  } catch (err) {
    // 详细的错误处理
    console.error('[Qiniu] 证书上传或部署失败:', err);

    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        throw new Error(
          `七牛云 API 错误: HTTP ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`
        );
      }
      throw new Error(`网络请求失败: ${axiosError.message}`);
    }

    throw new Error(`未知错误: ${err instanceof Error ? err.message : String(err)}`);
  }
}
