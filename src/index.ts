export { uploadCertificate } from './qiniu';
import { uploadCertificate } from './qiniu';
import fs from 'fs';

/**
 * 读取文件内容（如果文件存在）
 * @param filePath - 文件路径
 * @returns 文件内容，如果文件不存在则返回空字符串
 */
function readFileContentIfExists(filePath: string): string {
	if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
		return fs.readFileSync(filePath, 'utf8');
	}
	return '';
}

/**
 * GitHub Action 主入口函数
 * 从环境变量中读取配置，上传证书到七牛云
 */
export async function run(): Promise<void> {
	// 从环境变量获取配置参数
	const accessKey = process.env.INPUT_ACCESS_KEY || '';
	const secretKey = process.env.INPUT_SECRET_KEY || '';
	const certPath = process.env.INPUT_CERT || '';
	const keyPath = process.env.INPUT_KEY || '';
	const cert = readFileContentIfExists(certPath);
	const key = readFileContentIfExists(keyPath);
	const certName = process.env.INPUT_CERT_NAME || '';
	const deployToCDN = process.env.INPUT_DEPLOY_TO_CDN !== 'false';
	const certDomain = process.env.INPUT_CERT_DOMAIN || '';

	// 验证必需参数
	if (!accessKey || !secretKey || !cert || !key || !certName) {
		console.error('[Error] 参数缺失: 请提供 access_key, secret_key, cert, key 和 cert_name');
		process.exit(1);
	}
	if (deployToCDN && !certDomain) {
		console.error('[Error] 自动部署到 CDN 需指定 cert_domain 参数');
		process.exit(1);
	}

	try {
		const result = await uploadCertificate({
			accessKey,
			secretKey,
			cert,
			key,
			certName,
			deployToCDN,
			certDomain
		});

		console.log('[Success] 证书上传成功:', result);

		if (deployToCDN) {
			if (result.cdnDeploy) {
				console.log('[Success] CDN 证书部署成功:', result.cdnDeploy);
			} else {
				console.warn('[Warning] 未返回 CDN 部署结果');
			}
		}
	} catch (err) {
		console.error('[Error] 证书上传失败:', err instanceof Error ? err.message : err);
		process.exit(1);
	}
}

// 当直接运行此文件时执行 run 函数
if (require.main === module) {
	run();
}
