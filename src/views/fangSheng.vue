<template>
  <div class="fs">
    <div class="tab-wrap" v-show="tabs.length>0">
      <!--{{ 'Tue Feb 28 2017 18:48:44 GMT+0800' | dateTransform }}-->
      <!--{{ '/img/tt.png' | imgCdn }}-->
      <mt-navbar v-model="curTab" :style="'width:'+100*tabs.length+'px'">
        <!-- tab菜单 -->
        <mt-tab-item v-for="tab in tabs" :id="tab.id">{{tab.name}}</mt-tab-item>

      </mt-navbar>
    </div>
    <mt-tab-container v-model="curTab" v-show="tabs.length>0">

      <!-- tab内容块 -->
      <mt-tab-container-item v-for="(tab,index) in tabs" :id="tab.id">
        <ul class="fs-list" v-show="listData[tab.id].length > 0">
          <li v-for="item in listData[tab.id]">
            <a :href="item.contentUrl" class="fs-list-item">
              <img :src="item.picPath | imgCdn">
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
            </a>
          </li>
        </ul>
        <div class="no-data" v-show="listData[tab.id].length === 0">暂无数据!</div>
        <p class="btn-load-more" v-show="haveMore" @click="loadNewsMore(tab.id, ++curTabList[tab.id].curPage, index)">
          <span>查看更多...</span>
        </p>
      </mt-tab-container-item>

    </mt-tab-container>
    <div class="no-data" style="margin-top:-60px;" v-show="tabs.length === 0">暂无数据!</div>
    <div v-show="loading" class="loading-tip"><mt-spinner :type="3" :size="25" color="#26a2ff"></mt-spinner></div>
  </div>
</template>

<script>

export default {
  data () {
      return {
          curTab: 1
          ,tabs:[]
          ,listData: {}
          ,active: "1"
          ,list:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
          ,loading: false
          ,curTabList:{}
          ,pageSize:15
      }
  },
  methods:{
      loadCategories (){
          // 获取放生栏目下级分类，放生栏目id写死为1
          return this.axios.get('/api/front/categories/1')
      },
      loadNews (cid, page) {
          return this.axios.get('/api/front/news',{
              params:{
                  'categoryId':cid
                  ,'page':page || 0  // 奇葩接口要求页码从0开始
                  ,'size': this.pageSize || 15
              }
          })
      },
      // 点击加载更多数据
      loadNewsMore (cid, page, index) {
          this.loading=true
          this.loadNews(cid, page).then((res) => {
              var oldData=this.listData[cid].slice(0)
              var newData=oldData.concat(res.data)
              this.listData[cid]=[]
              this.$set(this.listData,cid,newData)
              this.loading=false
          })
      }
  },
  computed:{
      // 判断列表是否有更多数据
      haveMore (){
          var id=this.curTab
          if (this.listData[id]){
            return this.listData[id].length<this.curTabList[id].total
          }else{
            return false
          }
      }
  }
  ,created () {
      this.loadCategories().then((res) => {
          if (res.status==200 && res.data.length>0) {
              this.tabs=res.data
              this.curTab=res.data[0].id
              var tempData=[]
              this.tabs.forEach((item,index,self) => {
//                  tempData.push(_this.loadNews(item.id))
                  this.curTabList[item.id]={}
                  this.curTabList[item.id].curPage=0

                  this.loadNews(item.id).then((res) => {
                      // 从头信息x-total-count里获取数据总数
                      this.curTabList[item.id].total=res.headers['x-total-count']
                      this.$set(this.listData,item.id,res.data)
                  }).catch((err) => {
                      this.$toast('获取放生资讯数据失败！')
                      if (err.response){
                          console.dir(err.response)
                      }else{
                          console.log('Error:'+err.message)
                      }
                      console.log(err.config)
                  })
              })
//              this.axios.all(tempData).then(this.axios.spread(function (one, two, three) {
//                  _this.listData.push(one.data,two.data,three.data)
//              }))
          }else{

          }
      // 错误处理
      }).catch((err) => {
        this.$toast('获取放生分类数据失败！')
        if (err.response){
            console.dir(err.response)
        }else{
            console.log('Error:'+err.message)
        }
        console.log(err.config)
      })
  }
}
</script>

<style>
  .fs{
    margin-top:60px;
  }
  .fs-list > li{
    position:relative;
    padding-left:6rem;
    padding-right:10px;
  }
  .fs-list-item{
    display:block;
    height:100%;
    border-bottom:1px solid #e7e7e7;
    min-height:5.3rem;
    color:#000;
  }
  .fs-list-item > img{
    position:absolute;
    left:1rem;
    top:1rem;
    width:3.428rem;
    height:3.428rem;
    border-radius:0.3rem;
  }
  .fs-list-item h3{
    color:#000;
    font-size:1.237rem;
    font-weight:normal;
    line-height: 150%;
    margin:0;
    padding:0.8rem 0 0.5rem;
  }
  .fs-list-item p{
    margin:0;
    padding-bottom:10px;
    font-size:1rem;
    /*overflow:hidden;*/
    /*white-space: nowrap;*/
    /*text-overflow: ellipsis;*/
    color:#838383;
    line-height: 150%;
  }
  .btn-load-more{
    text-align: center;
    width: 10rem;
    margin: 10px auto;
    border:1px solid #efefef;
    padding: 6px;
    border-radius: 5px;
    font-size: 1rem;
    color:#666;
  }
  .loading-tip{
    position:fixed;
    bottom:60px;
    width:100%;
  }
  .loading-tip .mint-spinner-fading-circle{
    margin:0 auto;
  }
</style>