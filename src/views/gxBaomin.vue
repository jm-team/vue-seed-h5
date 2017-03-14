<template>
  <div>
    <div class="banner">
      <img src="../assets/img/gx-baomin-banner.jpeg" alt="">
    </div>
    <form class="gx-form" @submit.prevent="validateBeforeSubmit">
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
      <mt-cell title="数量" class="mint-field number-unit" :class="{ 'is-danger': errors.has('targetNum') }">
        <input class="mint-field-core" name="targetNum" v-model="registerObj.targetNum" v-validate:targetNum.initial="'required|numeric|max:10'"
          :class="{'input': true, 'is-danger': errors.has('targetNum') }" type="text" placeholder="请输入发愿念经数量">
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('targetNum')" :class="{ 'valid-alert': errors.has('targetNum') }">
          <span class="help is-danger">{{ errors.first('targetNum') }}</span>
        </mt-cell>
      </transition>
      <mt-cell title="手机" class="mint-field" :class="{ 'is-danger': errors.has('personMobile') }">
        <input class="mint-field-core" name="personMobile" v-model="registerObj.personMobile" v-validate:personName.initial="{ rules: { regex: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/, required: true, numeric: true } }"
          :class="{'input': true, 'is-danger': errors.has('personMobile') }" type="tel" placeholder="请输入手机号码">
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('personMobile')" :class="{ 'valid-alert': errors.has('personMobile') }">
          <span class="help is-danger">{{ errors.first('personMobile') }}</span>
        </mt-cell>
      </transition>
      <mt-cell class="mint-field multiple-input" :class="{ 'is-danger': errors.has('remark') }">
        <textarea class="mint-field-core" rows="4" name="remark" v-model="registerObj.remark" v-validate:remark.initial="'max:500'"
          :class="{'input': true, 'is-danger': errors.has('remark') }" type="text" placeholder="说说佛学感悟"></textarea>
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('remark')" :class="{ 'valid-alert': errors.has('remark') }">
          <span class="help is-danger">{{ errors.first('remark') }}</span>
        </mt-cell>
      </transition>
      <mt-button class="btn-submit">确认报名</mt-button>
    </form>
    <success-fullscreen-dialog :popupVisible="popupSuccessMessage" :dialog="successDialogObj" v-on:closeMe="popupSuccessMessage = false">
      <mt-button class="btn-baomin-medium" @click.prevent.native="goBaoshu">每日报数</mt-button>
      <mt-button class="btn-baomin-medium" @click.prevent.native="goMygongxiu">查看报名</mt-button>
    </success-fullscreen-dialog>
    <mt-popup v-model="popupFailedMessage" popup-transition="popup-fade" class="popup-dialog-falied">
      <h3>报名失败!</h3>
      <span class="pic-heshang-bg"></span>
      <mt-button class="btn-big-failed-close" @click.prevent.native="popupFailedMessage = false">我知道了</mt-button>
      <span class="btn-dialog-close" @click="popupFailedMessage = false"></span>
    </mt-popup>
    <!--<div v-show="loading" class="loading-tip" style="margin-bottom:300px"><mt-spinner :type="3" :size="25" color="#26a2ff"></mt-spinner></div>-->
  </div>
</template>
<script>
  import Vue from 'vue';

  import messages from './locale/zh_CN';
  import VeeValidate, {
    Validator
  } from 'vee-validate';

  import successFullscreenDialog from 'components/successFullscreenDialog'

  Vue.use(VeeValidate);

  // To prevent the errors from showing up before the user has typed anything we can use v-validate.initial instead of v-validate.
  Validator.updateDictionary({
    zh_CN: {
      messages: Object.assign({}, messages, {
        required: (field) => {
          if (field === '共修') {
            return `请选择${field}。`
          }
          return `请输入${field}。`
        },
        numeric: (field) => `${field} 只能包含数字。`,
      }),
      attributes: {
        eventId: '共修',
        personName: '姓名/法名',
        targetNum: '发愿念经数量',
        personMobile: '手机号码',
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
    },
    methods: {
      getUserInfo() {
        var userInfo = localStorage.userInfo;
        this.userInfo = Object.assign({}, JSON.parse(userInfo));
        this.registerObj = Object.assign({}, {
          personName: this.userInfo.personName,
          personMobile: this.userInfo.personMobile
        });
 
      },
      goBaoshu() {
        this.$router.push('/gx/baoshu')
      },
      goMygongxiu() {
        this.$router.push('/me/gongxiu')
      },
      validateBeforeSubmit() {
        // Validate All returns a promise and provides the validation result.
        this.$validator.validateAll().then(success => {
          if (!success) {
            // handle error
            return;
          }
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
        this.axios.get(`/api/front/events/regist/${userId}`).then((resp) => {
          vm.loading = false
          var data = resp.data || []
          vm.registList = data
        }).catch(function (error) {
          vm.$toast('获取活动数据失败！')
          vm.loading = false
        });
      },
      register() {
        this.error = null
        this.loading = true
        var vm = this;
        vm.registerObj = Object.assign({}, vm.registerObj, {
          userId: this.userInfo.id
        });
        this.axios.post('/api/front/regist', vm.registerObj).then((resp) => {
          vm.loading = false
          console.log('register success')
          // show register success message
          vm.popupSuccessMessage = true
        }).catch(function (error) {
          vm.loading = false
          // show register failed message
          vm.popupFailedMessage = true
        });
      }
    },
    components: {
      successFullscreenDialog
    },
    data() {
      return {
        loading: false,
        error: null,
        userInfo: {},
        registList: [],
        registerObj: {
          eventId: null,
          personMobile: null,
          personName: null,
          remark: null,
          targetNum: null,
          userId: null
        },
        popupSuccessMessage: false,
        popupFailedMessage: false,
        successDialogObj: {
          title: '报名成功!',
          subTitle: '阿弥陀佛! 感恩师兄!'
        }
      }
    }
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
  
  .gx-form .mint-field.multiple-input .mint-cell-title {
    width: 0;
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
  
  .gx-download-select {
    width: 100%;
    -webkit-appearance: none;
    border: none;
    outline: 0;
    background: url(../assets/img/arrow-down.png) no-repeat right center;
    background-size: 1.5rem 1.5rem;
    padding-right:1.8rem;
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
  
  .popup-dialog .button-group .btn-baomin-medium {
    width: 11.5rem;
    height: 4.2rem;
    color: #fff;
    background-color: #fc951d;
    border-radius: .2rem;
    font-size: 1.2rem;
  }
  
  .popup-dialog .button-group .mint-button+.mint-button {
    margin-left: 1rem;
  }
  
  .popup-dialog-falied {
    width: 23.2rem;
    height: 29.2rem;
    background-color: #fff;
    text-align: center;
    margin: 0 auto;
    padding: 5.2rem 1rem 0;
    border-radius: .3rem;
  }
  
  .popup-dialog-falied h3 {
    margin: 0 0 2.2rem;
    font-size: 2rem;
  }
  
  .btn-dialog-close {
    position: absolute;
    top: .7rem;
    right: .7rem;
    display: block;
    width: 1rem;
    height: 1rem;
    background: url(../assets/img/icon-dialog-close.png) no-repeat center center;
    background-size: 1rem 1rem;
  }
  
  .pic-heshang-bg {
    display: inline-block;
    width: 10.2rem;
    height: 13.7rem;
    background: url(../assets/img/pic-heshang.png) no-repeat center center;
    background-size: 10.2rem 13.7rem;
  }
  
  .btn-big-failed-close {
    width: 100%;
    color: #fff;
    background-color: #fc951d;
    border-radius: .2rem;
    font-size: 1.2rem;
    margin-top: .8rem;
  }
  
  .valid-help-enter-active {
    transition: opacity 3s ease;
  }
  
  .valid-help-enter,
  .valid-help-leave-active {
    opacity: 0;
    transition: opacity 0s ease;
  }
  
  .valid-alert .mint-cell-value {
    width: 100%;
    padding: .5rem;
    color: #fff;
    background: #f55567;
    border-radius: .3rem;
    position: relative;
    font-size: 1rem;
    font-weight: 100;
  }
  
  .valid-alert .mint-cell-value::after {
    content: "";
    position: absolute;
    left: 1rem;
    top: -.5rem;
    width: 1rem;
    height: 1rem;
    background-color: inherit;
    transform: rotate(45deg);
  }
  
  .is-danger .mint-cell-text {
    color: #f55567;
  }
</style>