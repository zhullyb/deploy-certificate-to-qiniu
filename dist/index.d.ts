export { uploadCertificate } from './qiniu';
/**
 * GitHub Action 主入口函数
 * 从环境变量中读取配置，上传证书到七牛云
 */
export declare function run(): Promise<void>;
