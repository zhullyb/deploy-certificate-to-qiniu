import * as qiniu from 'qiniu';
import axios from 'axios';

interface UploadParams {
  accessKey: string;
  secretKey: string;
  cert: string;
  key: string;
  certName: string;
}

const QINIU_API = 'https://api.qiniu.com/sslcert';

export async function uploadCertificate(params: UploadParams): Promise<any> {
  const { accessKey, secretKey, cert, key, certName } = params;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const body = {
      name: certName,
      common_name: certName,
      pri: key,
      ca: cert
    };
  const url = QINIU_API;
  const method = 'POST';
  const contentType = 'application/json';
  const accessToken = qiniu.util.generateAccessTokenV2(mac, url, method, contentType, JSON.stringify(body));
  try {
    const resp = await axios.post(url, body, {
      headers: {
        'Content-Type': contentType,
        'Authorization': accessToken
      }
    });
    return resp.data;
  } catch (err: any) {
    if (err.response) {
      throw new Error(`Qiniu API Error: ${err.response.status} ${JSON.stringify(err.response.data)}`);
    } else {
      throw new Error(`Network Error: ${err.message}`);
    }
  }
  }
