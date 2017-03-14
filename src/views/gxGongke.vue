<template>
  <div class="gx-gongke layoutTmp1">
    <div class="top-banner">
      <img src="../assets/img/gx-baomin-banner.jpeg">
    </div>
    <div class="content-box">
      <div class="main-title">功课查询</div>
      <div class="sub-title">阿弥陀佛！您参加的共修如下：</div>
      <div class="cell-list" v-show="kxData.length > 0">
        <div class="cell-item" v-for="item in kxData">
          <router-link :to="{ name:'gxGongkeList', params:{ id:item.id } , query:{ title:item.title }}" class="cell-link">{{ item.title }}</router-link>
          <p>&nbsp;<span v-show="item.createdTime">截止{{ item.createdTime | dateTransform }}</span><cite>已完成：<span>{{ item.completedCount }}</span> 部</cite></p>
        </div>
      </div>
      <div class="no-data" v-show="kxData.length === 0">暂无数据!</div>
    </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                kxData:[]
            }
        }
        ,methods:{
            alert:function () {
            }
        }
        ,created () {
            var root=this.$parent,
                userInfo=localStorage.userInfo
            if (userInfo) {
                userInfo = JSON.parse(userInfo)
                this.axios.get('/api/front/events/'+userInfo.id).then((res) => {
                    if (res.data && res.data.length>0){
                        this.kxData=res.data
                    }
                }).catch((err) => {
                    this.$toast('获取共修活动信息失败！')
                    if (err.response){
                        console.dir(err.response)
                    }else{
                        console.log('Error:'+err.message)
                    }
                    console.log(err.config)
                })
            }
        }
    }
</script>