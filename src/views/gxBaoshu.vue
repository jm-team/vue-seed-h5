<template>
  <div>
    <div class='abp'>
      <div ref='barrageContainer' class='container barrage-container'></div>
    </div>
    <form class="gx-form bao-shu" @submit.prevent="validateBeforeSubmit">
      <mt-cell title="共修" class="mint-field gx-download-select-container" :class="{ 'is-danger': errors.has('eventId') }">
        <select class="gx-download-select mint-field-core" v-model="registerObj.eventId" name="eventId" v-validate:eventId.initial="'required'"
          :class="{'input': true, 'is-danger': errors.has('eventId') }">
          <option value="">-请选择-</option>
          <option v-bind:value="reg.id" v-for="reg in registList">{{reg.title}}</option>
        </select>
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('eventId')" :class="{ 'valid-alert': errors.has('eventId') }">
          <span class="help is-danger">{{ errors.first('eventId') }}</span>
        </mt-cell>
      </transition>
      <mt-cell title="姓名" class="mint-field " :class="{ 'is-danger': errors.has('personName') }">
        <input class="mint-field-core" name="personName" v-model="registerObj.personName" v-validate:personName.initial="'required|max:10'"
          :class="{'input': true, 'is-danger': errors.has('personName') }" type="text" placeholder="请输入姓名/法名">
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('personName')" :class="{ 'valid-alert': errors.has('personName') }">
          <span class="help is-danger">{{ errors.first('personName') }}</span>
        </mt-cell>
      </transition>
      <mt-cell title="数量" class="mint-field number-unit" :class="{ 'is-danger': errors.has('completedNum') }">
        <input class="mint-field-core" name="completedNum" v-model="registerObj.completedNum" v-validate:targetNum.initial="'required|numeric|max:10'"
          :class="{'input': true, 'is-danger': errors.has('completedNum') }" type="text" placeholder="请输入今日念经数量">
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('completedNum')" :class="{ 'valid-alert': errors.has('completedNum') }">
          <span class="help is-danger">{{ errors.first('completedNum') }}</span>
        </mt-cell>
      </transition>
      <mt-cell title="时间" class="mint-field">
        <p class="date-field-value" @click="openPicker">{{formatDateTime}}</p>
      </mt-cell>
      <mt-cell class="mint-field multiple-input" :class="{ 'is-danger': errors.has('remark') }">
        <textarea class="mint-field-core" rows="4" name="remark" v-model="registerObj.remark" v-validate:remark.initial="'max:500'"
          :class="{'input': true, 'is-danger': errors.has('remark') }" type="text" placeholder="说说佛学感悟"></textarea>
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('remark')" :class="{ 'valid-alert': errors.has('remark') }">
          <span class="help is-danger">{{ errors.first('remark') }}</span>
        </mt-cell>
      </transition>
      <mt-button class="btn-submit">确认报数</mt-button>
      <mt-datetime-picker ref="picker" v-model="pickerValue" type="datetime" year-format="{value}年" month-format="{value}月" date-format="{value}日"
        hour-format="{value}时" minute-format="{value}分" @confirm="handleConfirm">
      </mt-datetime-picker>
    </form>
    <success-fullscreen-dialog :popupVisible="popupSuccessMessage" :dialog="successDialogObj" v-on:closeMe="popupSuccessMessage = false">
      <mt-button class="btn-baoshu-big-close" @click.prevent.native="goMygongxiu">查看我的共修</mt-button>
    </success-fullscreen-dialog>
    <mt-popup v-model="popupFailedMessage" popup-transition="popup-fade" class="popup-dialog-falied">
      <h3>保存失败!</h3>
      <span class="pic-heshang-bg"></span>
      <mt-button class="btn-big-failed-close" @click.prevent.native="popupFailedMessage = false">我知道了</mt-button>
      <span class="btn-dialog-close" @click="popupFailedMessage = false"></span>
    </mt-popup>
  </div>
</template>
<script>
  import successFullscreenDialog from 'components/successFullscreenDialog'

  import '../ccl/style.css'
  import CCL from '../ccl/CommentCoreLibrary.js'


  import Vue from 'vue';
  import messages from './locale/zh_CN';
  import VeeValidate, {
    Validator
  } from 'vee-validate';

  Vue.use(VeeValidate);

  // To prevent the errors from showing up before the user has typed anything we can use v-validate.initial instead of v-validate.
  Validator.updateDictionary({
    zh_CN: {
      messages: Object.assign({}, messages, {
        required: (field) => {
          if (field === '共修') {
            return `请选择${field}。`
          }

          return `请输入${field}`
        },
        numeric: (field) => `${field}只能包含数字`,
      }),
      attributes: {
        eventId: '共修',
        personName: '姓名/法名',
        completedNum: '今日念经数量',
        remark: '佛学感悟'
      }
    }
  });

  export default {
    created() {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.getUserInfo();

      this.$validator.setLocale('zh_CN');

      this.fetchRegisterList()
        console.log('created:')
        console.dir(this.registerObj)

    },
    methods: {
      getUserInfo() {
        var userInfo = localStorage.userInfo;
          console.dir(this.registerObj)
        this.userInfo = Object.assign({}, JSON.parse(userInfo));

        this.registerObj = Object.assign(this.registerObj, {
          personName: this.userInfo.personName,
          personMobile: this.userInfo.personMobile
        });

        

      },
      validateBeforeSubmit() {
        // Validate All returns a promise and provides the validation result.
        this.$validator.validateAll().then(success => {
          if (!success) {
            // handle error
            return;
          }
          //console.log('aaaa')
          this.register();
        }).catch(() => {
          // It has failed.
        });
      },
      fetchRegisterList() {
        this.error = this.registList = null
        this.loading = true
        var userId = this.userInfo.id;
        var vm = this;
        // 获取可报数所有活动列表
        this.axios.get(`/api/front/events/reportCount/${userId}`).then((resp) => {
          vm.loading = false
          var data = resp.data || []
          vm.registList = data
          if (data.length === 0){
              vm.$messagebox({
                  title: '提示',
                  message: '请先报名活动，再进入本页面报数',
                  showCancelButton: false,
                  confirmButtonText:'返回首页'
              }).then( active => {
                  vm.$router.push('/home')
              });
          }
        }).catch((err) => {
          vm.$toast('获取活动数据失败！')
          vm.loading = false
        });
      },
      goMygongxiu() {
        this.$router.push('/me/gongxiu')
      },
      register() {
        this.error = null
        this.loading = true
        var vm = this;
        //var ct = getFormatDateTimeBackend(vm.registerObj.createdTime);
          console.dir(vm.registerObj)
        vm.registerObj = Object.assign({}, vm.registerObj, {
          userId: this.userInfo.id,
          personMobile: this.userInfo.personMobile,
          createdTime: vm.registerObj.createdTime,
          modifyTime: vm.registerObj.createdTime
        });
        this.axios.post('/api/front/report-counts', vm.registerObj).then((resp) => {
          vm.loading = false
          //console.log('register success')
          // show register success message
          vm.popupSuccessMessage = true
        }).catch(function (error) {
          vm.loading = false
          // show register failed message
          vm.popupFailedMessage = true

        });
      },
      openPicker() {
        this.$refs.picker.open();
      },
      handleConfirm() {
        let dt = new Date(this.pickerValue)
        this.formatDateTime = getFormatDateTime(dt);
        //console.log('handleConfirm');
        //console.log(dt.toLocaleString());
        this.registerObj.createdTime = dt;
        this.registerObj.modifyTime = dt;
      }
    },
    components: {
      successFullscreenDialog
    },
    computed: {

    },
    mounted: function () {
      var vm = this;

      vm.formatDateTime = getFormatDateTime(new Date());

      //vm.$nextTick(function () {
      var CM = new CCL.CommentManager(this.$refs.barrageContainer);
      CM.init(); // 初始化

      // 昵称+#活动名称#+数量
      this.axios.get('/api/front/feedbacks/danmu').then((resp) => {

        var barrages = resp.data || [];

        var danmakuList = barrages.map((x) => formatBarrage(x))
        var delay = 12000;

        var danmuList = danmakuList.slice();

        if (danmuList.length <= 6) {
          CM.load(danmuList);
          setInterval(function () {
            danmuList.forEach(function (item) {
              CM.send(item);
            })
          }, delay);

        } else {
          // 每次显示6条弹幕
          var showingDanmu = danmuList.splice(0, 6)
          CM.load(showingDanmu);
          delay = 11000;
          setInterval(function () {
            if (danmuList.length === 0) {
              danmuList = danmakuList.slice();
            }
            showingDanmu = danmuList.splice(0, 6)
            showingDanmu.forEach(function (item) {
              CM.send(item);
            })

          }, delay);


        }

        // 启动播放弹幕（在未启动状态下弹幕不会移动）
        CM.start();
        CM.time(2000);
      }).catch(function (error) {

      });






      //         setInterval(function(){
      // // 插入弹幕
      //         var someDanmakuAObj = {
      //           "mode": 1,
      //           "text": "Hello CommentCoreLibrary",
      //           "stime": 1000,
      //           "size": 30,
      //           "color": 0xff0000
      //         };
      //         CM.insert(someDanmakuAObj);

      //         },4000)


    },

    data() {
      return {
        CM: null,
        loading: false,
        error: null,
        userInfo: {},
        registList: [],
        popupSuccessMessage: false,
        popupFailedMessage: false,
        formatDateTime: null,
        pickerValue: new Date(),
        registerObj: {
          completedNum: null,
          createdTime: new Date(),
          eventId: null,
          id: 0,
          modifyTime: null,
          personMobile: null,
          personName: null,
          remark: null,
          userId: null
        },
        successDialogObj: {
          title: '报数成功!',
          subTitle: '阿弥陀佛! 感恩师兄!'
        }
      }
    }
  }

  function formatBarrage(barrage) {
    // 昵称+#活动名称#+数量
    var x = `${barrage.personName} #${barrage.title}# +${barrage.completedNum}`;
    //console.log(x)

    return {
      "mode": 1,
      "text": x,
      "stime": 0,
      "size": 25,
      "color": 0xffffff
    }

  }


  function getFormatDateTime(dt) {
    //let dt = new Date(this.pickerValue),
    var year = dt.getFullYear(),
      month = padLeft(dt.getMonth() + 1),
      day = padLeft(dt.getDate()),
      hours = padLeft(dt.getHours()),
      minutes = padLeft(dt.getMinutes());

    return `${year}年${month}月${day}日${hours}:${minutes}`;
  }

  function getFormatDateTimeBackend(dt) {
    //let dt = new Date(this.pickerValue),
    var year = dt.getFullYear(),
      month = padLeft(dt.getMonth() + 1),
      day = padLeft(dt.getDate()),
      hours = padLeft(dt.getHours()),
      minutes = padLeft(dt.getMinutes()),
      seconds = padLeft(dt.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


  function padLeft(val) {
    let v = String(val);
    return v.length === 2 ? v : `0${v}`;
  }
</script>
<style>
  .banner {
    height: 15.6rem;
  }
  
  .banner img {
    width: 100%;
  }
  
  .gx-form {
    padding: 0 1.5rem;
  }
  
  .gx-form .mint-cell-wrapper {
    padding: 0;
    font-size: 1.2rem;
  }
  
  .gx-form .gx-download-select-container .mint-cell-wrapper {
    background-image: none;
  }
  
  .gx-form .mint-field .mint-cell-title {
    width: 4.5rem;
  }
  
  .number-unit .mint-cell-value {
    position: relative;
  }
  
  .number-unit .mint-cell-value::after {
    content: '（部）';
    position: absolute;
    right: .6rem;
    top: 0;
    flex: 1;
    line-height: 1.6;
    font-size: 1.2rem;
  }
  
  .date-field-value {
    width: 100%;
  }
  
  .gx-download-select {
    width: 100%;
    -webkit-appearance: none;
    border: none;
    outline: 0;
    background: url(../assets/img/arrow-down.png) no-repeat right center;
    background-size: 1.5rem 1.5rem;
  }
  
  .gx-form textarea {
    min-height: 8.5rem;
    margin-top: 1.5rem;
    border: .1rem solid #eaeaea;
    background: #f7f7f8;
    border-radius: .3rem;
  }
  
  .gx-form .btn-submit {
    display: block;
    margin: 1.5rem auto 4.3rem;
    width: 13.8rem;
    height: 3.8rem;
    border: .2rem solid #fdaa4a;
    border-radius: .2rem;
    color: #fdaa4a;
    font-size: 1.2rem;
  }
  
  .popup-dialog .button-group .btn-baoshu-big-close {
    width: 23.9rem;
    height: 4.2rem;
    color: #fc951d;
    border: .2rem solid #fc951d;
    border-radius: .2rem;
    font-size: 1.2rem;
  }
  
  .mint-datetime-picker .picker-items {
    overflow: hidden;
  }
  
  .mint-datetime-picker .picker-slot {
    overflow: visible;
  }
  
  .mint-datetime-picker .picker-item {
    font-size: 1.6rem;
  }
  
  .barrage-container {
    width: 100%;
    height: 15.5rem;
    margin: 0 auto;
    overflow: hidden;
    background: #000;
    opacity: .8;
  }
  .abp .container.barrage-container {
    position: relative;
  }
</style>