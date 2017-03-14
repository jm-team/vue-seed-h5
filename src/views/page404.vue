<template>
  <div class="page404">
    <p>404! 页面未找到!</p>
    <p>3秒后返回首页</p>
  </div>
</template>

<script>
export default {
  created () {
    setTimeout( ()=> this.$router.push('/home'),3000)
  }
}
</script>

<style>
.page404{
  padding:2rem;
  text-align:center;
}
</style>