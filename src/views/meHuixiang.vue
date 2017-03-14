<template>
  <div class="me-hx">
    <div class="hx-title">我的回向</div>
    <div class="hx-list" v-show="hxData.length > 0">
      <ul>
        <li v-for="item in hxData">
          <p>{{item.content}}</p>
          <span>{{item.createdTime | dateTransform}}</span>
        </li>
      </ul>
    </div>
    <div class="no-data" v-show="hxData.length === 0">暂无数据!</div>
    <p class="btn-load-more" v-show="haveMore" @click="loadMore">
      <span>查看更多...</span>
    </p>
    <div v-show="loading" class="loading-tip"><mt-spinner :type="3" :size="25" color="#26a2ff"></mt-spinner></div>
  </div>
</template>

<script>

export default {
  data () {
      return {
          hxData: []
          ,pageSize:15
          ,userId:null
          ,loading:false
          ,dataTotal:0
          ,curPage:0
      }
  }
  ,methods:{
      getHxData (page){
          return this.axios.get('/api/front/_search/feedbacks', {
              params:{
                  query:this.userId
                  ,page:page || this.curPage
                  ,size:this.pageSize || 15
              }
          })
      }
      // 加载更多
      ,loadMore () {
        this.loading=true
        this.getHxData(++this.curPage).then((res) => {
            var oldData=this.hxData.concat()
            this.hxData=oldData.concat(res.data)
            this.loading=false
        }).catch((err) => {
            this.$toast('获取回向信息失败！')
            if (err.response){
                console.dir(err.response)
            }else{
                console.log('Error:'+err.message)
            }
            console.log(err.config)
        })
      }
  }
  ,computed:{
      // 判断列表是否有更多数据
      haveMore (){
        return this.hxData.length < this.dataTotal
      }
  }
  ,created () {
      var root=this.$parent,
          userInfo=localStorage.userInfo
      if (userInfo){
          userInfo=JSON.parse(userInfo)
          this.userId=userInfo.id
          this.getHxData().then((res) => {
              if (res.data && res.data.length>0){
                  this.dataTotal=res.headers['x-total-count']
                  this.hxData=res.data
              }
          }).catch((err) => {
              this.$toast('获取回向信息失败！')
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

<style scoped>
  .hx-title{
    line-height: 4.2rem;
    background:#eee;
    font-size:1.237rem;
    color:#000;
    padding-left:1rem;
  }
  .hx-list ul{
    background:#eee;
  }
  .hx-list ul li{
    background:#fff;
    margin-bottom:1rem;
    padding:1rem;
  }
  .hx-list ul li p{
    font-size:1.237rem;
    margin:0;
    line-height: 180%;
  }
  .hx-list ul li > span{
    display:block;
    margin-top:0.5rem;
    font-size:1rem;
    color:#888;
  }
  .loading-tip{
    position:fixed;
    bottom:20px;
    width:100%;
  }
</style>