<template>
  <div class="listTmp1">
    <div class="list-title">{{ gxTitle }}</div>
    <div class="list-box" v-show="gxListData.length > 0">
      <ul>
        <li v-for="item in gxListData">{{ item.createdTime | dateTransform }}<span>{{ item.completedNum }}</span></li>
      </ul>
    </div>
    <div class="no-data" v-show="gxListData.length === 0">暂无数据!</div>
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
                gxId: this.$route.params.id
                ,gxTitle: this.$route.query.title
                ,gxListData: []
                ,curPage:0
                ,dataTotal:0
                ,pageSize:15
                ,userId:null
                ,loading:false
            }
        }
        ,methods:{
            getBxData (page){
                return this.axios.get('/api/front/_search/report-counts', {
                    params:{
                        userId:this.userId
                        ,eventId:this.gxId
                        ,page:page || this.curPage
                        ,size:this.pageSize || 15
                    }
                })
            }
            // 加载更多
            ,loadMore () {
                this.loading=true
                this.getBxData(++this.curPage).then((res) => {
                    var oldData=this.gxListData.concat()
                    this.gxListData=oldData.concat(res.data)
//                    _this.gxListData=oldData.concat({createdTime:'ewfe',completedNum:'11'})
                    this.loading=false
                }).catch((err) => {
                    this.$toast('获取共修信息失败！')
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
                return this.gxListData.length < this.dataTotal
            }
        }
        ,created () {
            var root=this.$parent,
                userInfo=localStorage.userInfo
            if (userInfo) {
                userInfo = JSON.parse(userInfo)
                this.userId=userInfo.id
                this.getBxData().then((res) => {
                    if (res.data && res.data.length>0){
                        this.dataTotal=res.headers['x-total-count']
                        this.gxListData=res.data
                    }
                }).catch((err) => {
                    this.$toast('获取共修信息失败！')
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