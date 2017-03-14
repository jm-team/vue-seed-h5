/**
 * @title address.config
 * @desc 配置依赖服务器地址
 * @type {{SERVER_ADDRESS: string, CENTER_ADDRESS: string, USERCENTER_ADDRESS: string, CDN_ADDRESS: string}}
 */

module.exports = {

    // api服务器
    // API_ADDRESS: "http://121.43.178.117:8080",
    API_ADDRESS: "http://121.43.178.117:8080",

    // 中台服务器
    CENTER_ADDRESS: "http://192.168.26.251:8889",

    // 单点认证中心
    USERCENTER_ADDRESS: "http://uc3.dev.com",

    // 静态资源CDN服务器
    CDN_ADDRESS: "/",

    // 图片服务器
    IMG_ADDRESS: "/api/front/news/image/",

    // 图片上传服务器
    UPLOAD_ADDRESS: "http://image5.jm.com"
}
