/**
 * 测试脚本 - 用于本地测试证书上传功能
 *
 * 使用方法:
 * node test/test.js \
 *   --access_key=YOUR_ACCESS_KEY \
 *   --secret_key=YOUR_SECRET_KEY \
 *   --cert=path/to/cert.pem \
 *   --key=path/to/key.pem \
 *   --cert_name=test-cert \
 *   --cert_domain=example.com \
 *   --deploy_to_cdn=true
 */

const { uploadCertificate } = require('../dist/index');
const fs = require('fs');

/**
 * 从命令行参数中获取指定名称的参数值
 * @param {string} name - 参数名称
 * @returns {string} 参数值，如果不存在则返回空字符串
 */
function getArg(name) {
  const arg = process.argv.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : '';
}

/**
 * 验证参数的完整性
 * @param {Object} args - 参数对象
 * @throws {Error} 当必需参数缺失时退出程序
 */
function validateArgs(args) {
	const requiredFields = {
		accessKey: 'access_key',
		secretKey: 'secret_key',
		cert: 'cert',
		key: 'key',
		certName: 'cert_name'
	};

	for (const [field, displayName] of Object.entries(requiredFields)) {
		if (!args[field]) {
			console.error(`[Error] 缺少必要参数: ${displayName}`);
			console.error('\n使用方法示例:');
			console.error('  node test/test.js --access_key=xxx --secret_key=xxx --cert=cert.pem --key=key.pem --cert_name=test --cert_domain=example.com');
			process.exit(1);
		}
	}

	if (args.deployToCDN && !args.certDomain) {
		console.error('[Error] 启用 CDN 部署时，cert_domain 参数不能为空');
		process.exit(1);
	}
}

/**
 * 主函数 - 解析参数并执行证书上传
 */
async function main() {
	try {
		// 解析命令行参数
		const certPath = getArg('cert');
		const keyPath = getArg('key');

		const args = {
			accessKey: getArg('access_key'),
			secretKey: getArg('secret_key'),
			cert: certPath ? fs.readFileSync(certPath, 'utf8') : '',
			key: keyPath ? fs.readFileSync(keyPath, 'utf8') : '',
			certName: getArg('cert_name'),
			deployToCDN: getArg('deploy_to_cdn') !== 'false',
			certDomain: getArg('cert_domain'),
		};

		// 验证参数
		validateArgs(args);

		// 执行上传
		console.log('[Test] 开始测试证书上传...');
		const result = await uploadCertificate(args);
		console.log('[Test] 测试完成，结果:', result);
	} catch (err) {
		console.error('[Test] 测试失败:', err.message || err);
		process.exit(1);
	}
}

main();
