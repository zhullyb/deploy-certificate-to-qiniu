import * as qiniu from 'qiniu';
import axios, { AxiosError } from 'axios';

/**
 * CDN HTTPS 配置接口
 */
interface HttpsConfig {
  /** 证书 ID */
  certId: string;
  /** 是否强制 HTTPS */
  forceHttps: boolean;
  /** 是否启用 HTTP/2 */
  http2Enable: boolean;
  /** 是否为免费证书 */
  freeCert?: boolean;
  /** 支持的 TLS 版本 */
  tlsVersions?: string[];
}

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
export function generateQiniuHeaders(
  mac: qiniu.auth.digest.Mac,
  url: string,
  method: string,
  contentType: string,
  body: string = ''
): Record<string, string> {
  const accessToken = qiniu.util.generateAccessTokenV2(mac, url, method, contentType, body);
  return {
    Authorization: accessToken,
    'Content-Type': contentType,
  };
}

/**
 * 部署证书到七牛云 CDN 域名
 * @param mac - 七牛云认证对象
 * @param certId - 证书 ID
 * @param domain - CDN 域名
 * @returns CDN 部署结果
 * @throws 当 API 请求失败时抛出异常
 */
export async function deployCertToCDN(
  mac: qiniu.auth.digest.Mac,
  certId: string,
  domain: string
): Promise<CdnDeployResult> {
  try {
    // 1. 获取当前域名的 HTTPS 配置
    const getDomainUrl = `https://api.qiniu.com/domain/${domain}`;
    console.log(`[Qiniu] 获取域名 HTTPS 配置: ${getDomainUrl}`);

    const getResp = await axios.get(getDomainUrl, {
      headers: generateQiniuHeaders(mac, getDomainUrl, 'GET', 'application/json'),
    });

    const currentHttpsConfig = getResp.data.https || {};
    const { forceHttps = false, http2Enable = true } = currentHttpsConfig;
    console.log(currentHttpsConfig);

    // 2. 更新域名证书配置
    const updateCertUrl = `${getDomainUrl}/httpsconf`;
    const requestBody = { certId, forceHttps, http2Enable };

    console.log(`[Qiniu] 更新域名证书: ${updateCertUrl}`);

    const putResp = await axios.put(updateCertUrl, requestBody, {
      headers: generateQiniuHeaders(
        mac,
        updateCertUrl,
        'PUT',
        'application/json',
        JSON.stringify(requestBody)
      ),
    });

    // 3. 获取更新后的 HTTPS 配置进行验证
    const verifyResp = await axios.get(getDomainUrl, {
      headers: generateQiniuHeaders(mac, getDomainUrl, 'GET', 'application/json'),
    });

    console.log('[Qiniu] 更新后域名 HTTPS 配置:', verifyResp.data.https);

    return putResp.data;
  } catch (err) {
    console.error('[Qiniu] CDN 证书部署失败:', err);

    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        throw new Error(
          `七牛云 CDN API 错误: HTTP ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`
        );
      }
      throw new Error(`网络请求失败: ${axiosError.message}`);
    }

    throw new Error(`未知错误: ${err instanceof Error ? err.message : String(err)}`);
  }
}
