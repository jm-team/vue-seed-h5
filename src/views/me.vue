<template>
  <div class="me">
    <div class="user-info">
      <router-link to="/me/profile" class="info"><img :src="userInfo.headimgurl || '../assets/img/pic-user-big.jpg'">{{userInfo.alias}}</router-link>
    </div>
    <div class="user-nav">
      <ul>
        <li><router-link to="/me/gongxiu" class="icon-me-kx">我的共修</router-link></li>
        <li><router-link to="/me/huixiang" class="icon-me-hx">我的回向</router-link></li>
      </ul>
    </div>
    <!--<input style="margin-left:50px" type="text" v-focus>-->
  </div>
</template>

<script>
// import render from 'components/render'

export default {
  data () {
      return {
          userInfo: {}
      }
  }
  ,created (){
      var root=this.$parent
      this.userInfo=JSON.parse(localStorage.userInfo)
  }
}
</script>

<style scoped>
  .me{
    background:#efeff4;
  }
  .user-info{
    padding:0 1rem;
    background:#fff;
    border-bottom:1px solid #eee;
    margin-bottom:1rem;
  }
  .user-info .info{
    position:relative;
    display:block;
    line-height:7.7rem;
    font-size:1.4rem;
    color:#333;
    padding-left:6rem;
    background:url('../assets/img/arrow-right.png') no-repeat center right;
    background-size:1.8rem auto;
  }
  .user-info .info > img{
    position:absolute;
    left:0;
    top:1.5rem;
    width:4.5rem;
    height:4.5rem;
    border-radius:50%;
  }
  .user-nav ul li{
    padding:0 1rem;
    background:#fff;
    line-height: 6.3rem;
    border-bottom:1px solid #eee;
  }
  .user-nav ul li > a{
    display: block;
    color:#000;
    font-size:1.237rem;
    background:url('../assets/img/arrow-right.png') no-repeat center right;
    background-size:1.8rem auto;
  }
  .icon-me-kx::before,
  .icon-me-hx::before{
    content:'';
    display:inline-block;
    vertical-align:middle;
    width:2.3rem;
    height:2.3rem;
    margin-right:1rem;
  }
  .icon-me-kx::before{
    background:url('../assets/img/icon-cell-kx.png') no-repeat left -2px;
    background-size:100% auto;
  }
  .icon-me-hx::before{
    background:url('../assets/img/icon-cell-hx.png') no-repeat left -2px;
    background-size:100% auto;
  }
</style>