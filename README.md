# Deploy Certificate to Qiniu

Github Action：上传 SSL 证书到七牛云 CDN（Fusion）

## 使用方法

### Github Action
```yaml
- name: Deploy SSL Certificate to Qiniu
  uses: zhullyb/deploy-certificate-to-qiniu@main
  with:
    access_key: ${{ secrets.QINIU_AK }}
    secret_key: ${{ secrets.QINIU_SK }}
    cert: ${{ secrets.SSL_CERT }}
    key: ${{ secrets.SSL_KEY }}
    cert_name: my-cert-name
```

### 本地测试
```bash
pnpm install
pnpm run test -- --access_key=xxx --secret_key=xxx --cert=cert.pem --key=key.pem --cert_name=my-cert-name
```

## 七牛云 API 文档
- [证书上传接口](https://developer.qiniu.com/fusion/8593/interface-related-certificate)
