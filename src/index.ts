import { uploadCertificate } from './qiniu';
import fs from 'fs';

async function run() {
  const accessKey = process.env.INPUT_ACCESS_KEY || '';
  const secretKey = process.env.INPUT_SECRET_KEY || '';
  let cert = process.env.INPUT_CERT || '';
  let key = process.env.INPUT_KEY || '';
  const certName = process.env.INPUT_CERT_NAME || '';

  // 如果 cert/key 是文件路径，则读取内容
  if (cert && fs.existsSync(cert) && fs.statSync(cert).isFile()) {
    cert = fs.readFileSync(cert, 'utf8');
  }
  if (key && fs.existsSync(key) && fs.statSync(key).isFile()) {
    key = fs.readFileSync(key, 'utf8');
  }

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
