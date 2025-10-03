import { uploadCertificate } from './qiniu';

async function run() {
  const accessKey = process.env.INPUT_ACCESS_KEY || '';
  const secretKey = process.env.INPUT_SECRET_KEY || '';
  const cert = process.env.INPUT_CERT || '';
  const key = process.env.INPUT_KEY || '';
  const certName = process.env.INPUT_CERT_NAME || '';

  if (!accessKey || !secretKey || !cert || !key || !certName) {
    console.error('参数缺失');
    process.exit(1);
  }

  try {
    const result = await uploadCertificate({ accessKey, secretKey, cert, key, certName });
    console.log('上传成功:', result);
  } catch (err) {
    console.error('上传失败:', err);
    process.exit(1);
  }
}

run();
