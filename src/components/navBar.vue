<template>
    <mt-tabbar v-model="curMenu" v-show="showNav">
      <mt-tab-item id="gx" :class="{'is-selected': route === '/home'}">
        <router-link to="/home" class="nav-gx">共修</router-link>
      </mt-tab-item>
      <mt-tab-item id="fs" :class="{'is-selected': route === '/fs'}">
        <router-link to="/fs" class="nav-fs">放生</router-link>
      </mt-tab-item>
      <mt-tab-item id="foshi" :class="{'is-selected': route === '/foshi'}">
        <router-link to="/foshi" class="nav-foshi">佛事</router-link>
      </mt-tab-item>
      <mt-tab-item id="me" :class="{'is-selected': route === '/me'}">
        <router-link to="/me" class="nav-me">我的</router-link>
      </mt-tab-item>
    </mt-tabbar>
</template>

<script>
export default {
  name: 'navBar',
  props: {
      'showNav': {
          type: Boolean,
          default: true
      }
  },
  computed: {
      route () {
          return this.$route.path
      }
  },
  data () {
      return {
          curMenu:''
      }
  }
}
</script>

<style>
  .mint-tabbar{
    position: fixed;
    background-color: #f7f7f7;
    background-image: linear-gradient(180deg, #e7e7e7, #e7e7e7 50%, transparent 50%);
  }
  .mint-tab-item{
    padding:0;
  }
  .mint-tab-item-label > a{
    display:inline-block;
    width:100%;
    height:16px;
    padding-top:32px;
    text-decoration: none;
    color:#999;
  }
  .mint-tabbar > .mint-tab-item.is-selected{
    background:none;
  }
  .mint-tabbar > .mint-tab-item.is-selected .mint-tab-item-label > a{
    color:#fc951d;
  }
  .nav-gx{
    background:url('../assets/img/menu-kx.png') no-repeat center 5px;
    background-size:30px auto;
  }
  .mint-tab-item.is-selected .nav-gx{
    background:url('../assets/img/menu-kx-sel.png') no-repeat center 5px;
    background-size:30px auto;
  }
  .nav-fs{
    background:url('../assets/img/menu-fs.png') no-repeat center 5px;
    background-size:30px auto;
  }
  .mint-tab-item.is-selected .nav-fs{
    background:url('../assets/img/menu-fs-sel.png') no-repeat center 5px;
    background-size:30px auto;
  }
  .nav-foshi{
    background:url('../assets/img/menu-fuoshi.png') no-repeat center 5px;
    background-size:30px auto;
  }
  .mint-tab-item.is-selected .nav-foshi{
    background:url('../assets/img/menu-fuoshi-sel.png') no-repeat center 5px;
    background-size:30px auto;
  }
  .nav-me{
    background:url('../assets/img/menu-me.png') no-repeat center 5px;
    background-size:30px auto;
  }
  .mint-tab-item.is-selected .nav-me{
    background:url('../assets/img/menu-me-sel.png') no-repeat center 5px;
    background-size:30px auto;
  }
</style>