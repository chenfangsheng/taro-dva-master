import index from '../pages/index/config' // index接口
/** 
 * 请求的公共参数
 */
export const commonParame = {}

/**
 * 请求映射文件
 */
export const requestConfig = {
  loginUrl: '/api/user/wechat-auth', // 微信登录接口
  ...index
}