// 公共ajax模块，使用axios插件，配置默认参数后供全站使用

function getWxCode(){
    var APPID='wx3cc316245de4b71f',
        REDIRECT_URI=encodeURIComponent('http://wxdev02.jumore.com'),
        SCOPE='snsapi_userinfo',  //基础授权
        STATE='123' // 没啥用，估计是用来防止缓存的
    var wxUrl=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
    //window.location.href=wxUrl
    console.log(wxUrl)
}

// getWxCode()


// export default getWxCode