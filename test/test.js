const { uploadCertificate } = require('../dist/qiniu');
const fs = require('fs');

function getArg(name) {
  const arg = process.argv.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : '';
}

async function main() {
  const accessKey = getArg('access_key');
  const secretKey = getArg('secret_key');
  const certPath = getArg('cert');
  const keyPath = getArg('key');
  const certName = getArg('cert_name');

  if (!accessKey || !secretKey || !certPath || !keyPath || !certName) {
    console.error('参数缺失');
    process.exit(1);
  }

  const cert = fs.readFileSync(certPath, 'utf8');
  const key = fs.readFileSync(keyPath, 'utf8');

  try {
    const result = await uploadCertificate({ accessKey, secretKey, cert, key, certName });
    console.log('上传成功:', result);
  } catch (err) {
    console.error('上传失败:', err);
    process.exit(1);
  }
}

main();
