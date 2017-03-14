<template>
  <div>
    <top-swiper></top-swiper>
    <div class="primary-item-links-container bottom-border-5px">
      <ul class="primary-item-links clear">
        <li>
          <router-link to="/gx/baomin">
            <span class="gx-gxbm"></span>
            <p>共修报名</p>
          </router-link>
        </li>
        <li>
          <router-link to="/gx/baoshu">
            <span class="gx-mrbs"></span>
            <p>每日报数</p>
          </router-link>
        </li>
        <li>
          <router-link to="/gx/huixiang">
            <span class="gx-gdhx"></span>
            <p>功德回向</p>
          </router-link>
        </li>
        <li>
          <router-link to="/gx/gongke">
            <span class="gx-gkcx"></span>
            <p>功课查询</p>
          </router-link>
        </li>
      </ul>
    </div>
    <!--end of primary-item-links-container-->
    <div class="gx-summary bottom-border-5px">
      <div v-for="(activity,index) in activities" class="item" v-bind:class="{ 'bottom-border-1px': index !== activities.length - 1 }">
        <h3>{{activity.title}}</h3>
        <ul class="clear">
          <li class="fn-left">
            <div class="item-cell-left">
              <p class="label">共修人数</p>
              <p class="number">{{activity.personCount | numberWithCommas}}</p>
            </div>
          </li>
          <li class="fn-left">
            <div class="item-cell-right">
              <p class="label">已完成</p>
              <p class="number">{{activity.completedCount | numberWithCommas}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--end of gx-summary-->
    <div class="latest-notice">
      <h6 class="notice-header bottom-border-1px">最新公告</h6>
      <ul v-show="notices.length>0">
        <li class="bottom-border-1px" v-for="notice in notices">
          <a class="notice-item" v-bind:href="notice.contentUrl">
            <!--<img v-bind:src="notice.picPath | imgCdn" alt="">-->
            <img v-lazyload="lazyLoadPic(notice.picPath)">
            <div class="notice-intro">
              <h6>{{notice.title}}</h6>
              <p style="-webkit-box-orient: vertical;">{{notice.summary}}</p>
            </div>
          </a>
        </li>
        <!--<li class="bottom-border-1px last">
          <div class="notice-item ">
            <img src="../assets/img/pic-notice.jpg" alt="">
            <div class="notice-intro">
              <h6>第四届百万佛号共修</h6>
              <p>阿弥陀佛！各位道友，2015——2016第三届百万佛号共修已于公历2016年11月...</p>
            </div>
          </div>
        </li>-->
      </ul>
      <div class="no-data" v-show="notices.length === 0" style="padding-left:1.5rem">暂无数据!</div>      
    </div>
  </div>
</template>
<script>
  import topSwiper from 'components/topSwiper'
  import Vue from 'vue'

  export default {
    data() {
      return {
        loading: false,
        activities: null,
        notices: null,
        error: null
        ,wxCode: this.$route.query.code
        ,userInfo:'test'
      }
    },

    components: {
      topSwiper
    }
    ,created() {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      var root=this.$parent
      this.fetchActivities()
      this.fetchNotices()
    },
    filters: {
      // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
      numberWithCommas: function (value) {
        var parts = value.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      }
    },
    methods: {
      lazyLoadPic(url) {
          return Vue.filter('imgCdn')(url)
      }
      ,fetchActivities() {
        this.error = this.activities = null
        this.loading = true
        this.axios.get('/api/front/events').then((resp) => {
          this.loading = false
          var data = resp.data || []
//          this.activities = data.slice(0, 2)
          this.activities = data
        }).catch((error) => {
          this.$toast('获取活动信息失败！')
          this.loading = false
        });
      },
      fetchNotices() {
        this.error = this.notices = null
        this.loading = true
        this.axios.get('/api/front/news').then((resp) => {
          this.loading = false
          var data = resp.data || []
          this.notices = data
        }).catch((error) => {
          this.$toast('获取公告信息失败！')
          this.loading = false
        });
      }
    }
  }

</script>
<style>
.bottom-border-5px {
  border-bottom: 0.5rem solid #f7f7f8;
}

.bottom-border-1px {
  border-bottom: 0.1rem solid #f7f7f8;
}

.primary-item-links-container {
  padding-top: 2rem;
  padding-bottom: 1.2rem;
}

.primary-item-links {
  padding-left: 0;
  color: #000;
}

.primary-item-links li {
    float: left;
    width: 25%;
    list-style: none;
    text-align: center;
    font-size: 1.2rem;
}

.primary-item-links li a {
      color: #000;
}

.primary-item-links p {
    margin: .8rem 0;
}

.gx-gxbm {
  display: block;
  height: 4.534rem;
  background: url(../assets/img/icon-nav-baomin.png) no-repeat center;
  background-size: auto 4.534rem;
}

.gx-mrbs {
  display: block;
  height: 4.534rem;
  background: url(../assets/img/icon-nav-baoshu.png) no-repeat center;
  background-size: auto 4.534rem;
}

.gx-gdhx {
  display: block;
  height: 4.534rem;
  background: url(../assets/img/icon-nav-huixiang.png) no-repeat center;
  background-size: auto 4.534rem;
}

.gx-gkcx {
  display: block;
  height: 4.534rem;
  background: url(../assets/img/icon-nav-gongke.png) no-repeat center;
  background-size: auto 4.534rem;
}

.gx-summary {
  background: url(../assets/img/home-bg.jpg) repeat-y;
  background-size: 100% auto;
}

.gx-summary h3 {
    margin-top: 0;
    margin-bottom: .9rem;
    font-size: 1.8rem;
    color: #000;
}

.gx-summary li {
    width: 50%;
}

.gx-summary .item {
    padding: 2rem 1.6rem;
}

.gx-summary .label {
    margin-top: 0;
    margin-bottom: .9rem;
    font-size: .9rem;
    color: #838383;
}

.gx-summary .number {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.2rem;
    color: #fc951d;
}

.gx-summary .item-cell-left {
    width: 18rem;
}

.gx-summary .item-cell-right {
    width: 10.8rem;
    padding-left: 3.5rem;
}

.latest-notice {
  margin-bottom: 54px;
}

.latest-notice .notice-header {
    padding-left: 1.6rem;
    line-height: 3.2rem;
    margin-bottom: 0;
}

.latest-notice .notice-item {
    display: block;
    padding: 1.4rem 1.6rem;
    position: relative;
}

.latest-notice .notice-intro {
    padding-left: 10rem;
}

.latest-notice li:last-child {
    border-bottom: 0;
}

.latest-notice h6 {
    margin: .2rem 0 1rem;
    font-size: 1.2rem;
    color: #000;
}

.latest-notice img {
    position: absolute;
    left: 1.6rem;
    top: 1.4rem;
    width: 8.3rem;
    height: 6.2rem;
}

.latest-notice p {
    line-height: 1.6rem;
    max-height: 3.2rem;
    font-size: .9rem;
    color: #838383;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
}
</style>