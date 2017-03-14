<template>

</template>
<script>
    export default{
     created (){
         var APPID='wx3cc316245de4b71f',
             REDIRECT_URI=encodeURIComponent('http://h5.sanbaozhihui.com/home'),
             SCOPE='snsapi_userinfo',  //基础授权 snsapi_base / snsapi_userinfo
             STATE='123'
         var wxUrl=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
             window.location.href=wxUrl
     }
    }
</script>