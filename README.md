# Deploy Certificate to Qiniu

GitHub Action: 自动上传 SSL 证书到七牛云并部署到 CDN

## 功能特性

- 🚀 自动上传 SSL 证书到七牛云证书管理
- 🔄 自动部署证书到七牛云 CDN 域名
- 🔒 支持 GitHub Secrets 安全存储敏感信息
- ⚙️ 灵活配置，可选择是否自动部署到 CDN

## 使用方法

### GitHub Action 集成

在你的 GitHub 仓库中创建 `.github/workflows/deploy-cert.yml` 文件：

```yaml
name: Deploy SSL Certificate

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Deploy SSL Certificate to Qiniu
        uses: zhullyb/deploy-certificate-to-qiniu@main
        with:
          access_key: ${{ secrets.QINIU_AK }}
          secret_key: ${{ secrets.QINIU_SK }}
          cert: ${{ secrets.SSL_CERT }}
          key: ${{ secrets.SSL_KEY }}
          cert_name: my-cert-name
          cert_domain: your-domain.com
          deploy_to_cdn: 'true'
```

### 本地测试

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 运行测试
pnpm run test -- \
  --access_key=YOUR_ACCESS_KEY \
  --secret_key=YOUR_SECRET_KEY \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem \
  --cert_name=my-cert-name \
  --cert_domain=your-domain.com \
  --deploy_to_cdn=true
```

## 参数说明

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `access_key` | 是 | - | 七牛云 Access Key |
| `secret_key` | 是 | - | 七牛云 Secret Key |
| `cert` | 是 | - | SSL 证书内容（PEM 格式）或文件路径 |
| `key` | 是 | - | SSL 证书私钥内容（PEM 格式）或文件路径 |
| `cert_name` | 是 | - | 证书名称（用于七牛云证书管理） |
| `cert_domain` | 条件 | - | CDN 域名，`deploy_to_cdn` 为 `true` 时必填 |
| `deploy_to_cdn` | 否 | `true` | 是否自动部署证书到 CDN，设置为 `false` 可跳过 CDN 部署 |

## GitHub Secrets 配置

在仓库的 **Settings > Secrets and variables > Actions** 中添加以下 secrets：

- `QINIU_AK`: 七牛云 Access Key
- `QINIU_SK`: 七牛云 Secret Key
- `SSL_CERT`: SSL 证书内容（PEM 格式）
- `SSL_KEY`: SSL 证书私钥内容（PEM 格式）

## 工作原理

1. **上传证书**: 将 SSL 证书和私钥上传到七牛云证书管理服务
2. **获取证书 ID**: 从上传响应中获取证书 ID
3. **部署到 CDN**: （可选）使用证书 ID 更新指定 CDN 域名的 HTTPS 配置
4. **验证部署**: 检查更新后的配置是否正确

## 开发

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 运行测试
pnpm run test -- --access_key=xxx --secret_key=xxx --cert=cert.pem --key=key.pem --cert_name=test --cert_domain=example.com
```

## 相关文档

- [七牛云证书管理 API](https://developer.qiniu.com/fusion/8593/interface-related-certificate)
- [七牛云 CDN HTTPS 配置](https://developer.qiniu.com/pili/9900/live-domain-certificate)

## License

MIT
