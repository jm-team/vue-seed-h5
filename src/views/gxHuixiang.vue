<template>
  <div>
    <header class="gx-huixiang-header">
      功德回向：
    </header>
    <section class="gx-huixiang-main-content">
      <p>愿以此功德，庄严佛净土，</p>
      <p>上报四重恩，下济三途苦，</p>
      <p>若有见闻者，悉发菩提心，</p>
      <p>尽此一报身，同生极乐国；</p>
      <p>愿消三障诸烦恼，愿得智慧真明了，</p>
      <p>普愿罪障悉消除，世世常行菩萨道。 </p>
      <p>回向给尽虚空遍法界一切有情众生早日离苦得乐，圆证佛果。 </p>
      <p>愿世界和平，国泰民安，风调雨顺，人民生活安居乐业。</p>
      <p>愿佛法兴盛，正法久住！</p>
    </section>
    <form @submit.prevent="validateBeforeSubmit">
      <section class="gx-huixiang-personal-note">
        <header>个人回向</header>
        <div>
          <mt-cell class="mint-field is-textarea multiple-input" :class="{ 'is-danger': errors.has('content') }">
            <!-- v-bind:maxlength="maxInputCount"-->
            <textarea class="mint-field-core" rows="8" name="content" v-model="content" v-validate:remark.initial="'required|max:1000'"
              :class="{'input': true, 'is-danger': errors.has('content') }" placeholder="弟子（姓名/法名）今日所修之功德融于共修之功德海......"></textarea>
          </mt-cell>
        </div>
        <transition name="valid-help">
          <mt-cell v-show="errors.has('content')" :class="{ 'valid-alert': errors.has('content') }">
            <span class="help is-danger">{{ errors.first('content') }}</span>
          </mt-cell>
        </transition>
        <p class="remian-input-length">还可以输入{{remainCount}}个字</p>
      </section>
      <mt-button class="gx-huixiang-btn-submit">确认提交</mt-button>
    </form>
    <success-fullscreen-dialog :popupVisible="popupSuccessMessage" :dialog="successDialogObj" v-on:closeMe="popupSuccessMessage = false">
      <mt-button class="btn-baoshu-big-close" @click.prevent.native="goHome">返回首页</mt-button>
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
        required: (field) => ` 请输入${field}。`,
      }),
      attributes: {
        content: '个人回向'
      }
    }
  });


  export default {
    created() {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.getUserInfo();

      this.$validator.setLocale('zh_CN');

      this.getFeedback();

    },
    components: {
      successFullscreenDialog
    },
    computed: {
      // a computed getter
      remainCount: function () {
        // `this` points to the vm instance
        let text = this.content || '';
        let inputLength=this.maxInputCount - text.length
          if (inputLength < 0){
            this.content=this.content.slice(0,this.maxInputCount)
//              console.log(this.content)
              inputLength=0
          }
        return inputLength;
      }
    },
    methods: {
      getUserInfo() {
        var userInfo = localStorage.userInfo;
        this.userInfo = Object.assign({}, JSON.parse(userInfo));
      },
      goHome() {
        this.$router.push('/home')
      },
      validateBeforeSubmit() {
        // Validate All returns a promise and provides the validation result.
        this.$validator.validateAll().then(success => {
          if (!success) {
            // handle error
            return;
          }
          this.save();
        }).catch(() => {
          // It has failed.
        });
      },
      getFeedback: function() {
          this.feedbackObj = Object.assign({}, {
            "createdTime": new Date(),
            "id": 0,
            "personMobile": this.userInfo.personMobile,
            "personName": this.userInfo.personName,
            "userId":this.userInfo.id,
            "wxNo": this.userInfo.wxNo
          })
        
      },
      save: function () {
        this.error = null
        this.loading = true
        var vm = this;
        var obj = Object.assign({}
        //,vm.feedbackObj
        , {userId: this.userInfo.id,content: vm.content})
        // POST /api/front/feedbacks
        this.axios.post('/api/front/feedbacks', obj).then((resp) => {
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
    data() {
      return {
        loading: false,
        error: null,
        userInfo: {},
        feedbackObj:{},
        content: null,
        maxInputCount: 1000,
        popupSuccessMessage: false,
        popupFailedMessage: false,
        successDialogObj: {
          title: '保存成功!',
          subTitle: '阿弥陀佛! 感恩师兄!'
        }
      }
    }
  }
</script>
<style>
.gx-huixiang-header {
  line-height: 4.8rem;
  padding-left: 5.7rem;
  background: url(../assets/img/gx-huixiang-header-bg.png) no-repeat 1.5rem center;
  background-size: 3.2rem auto;
  background-color: #f7f7f8;
  font-size: 1.2rem;
}
.gx-huixiang-main-content {
  padding: 0 1.5rem;
  border-bottom: 0.5rem solid #f7f7f8;
}
.gx-huixiang-personal-note {
  padding: 0 1.5rem;
  position: relative;
}
.gx-huixiang-personal-note header {
  font-size: 1.2rem;
  line-height: 4.2rem;
}
.gx-huixiang-personal-note .mint-cell-wrapper {
  padding: 0;
}
.gx-huixiang-personal-note .mint-field.is-textarea .mint-cell-value {
  padding-left: 0;
  padding-right: 0;
  font-size: 1.2rem;
}
.remian-input-length {
  /*position: absolute;
  bottom: 0;
  left: 1.5rem;*/
  margin: .6rem 0;
  font-size: .9rem;
}
.gx-huixiang-btn-submit {
  display: block;
  margin: 1.5rem auto 4.3rem;
  width: 13.8rem;
  height: 3.8rem;
  border: .2rem solid #fdaa4a;
  border-radius: .2rem;
  color: #fdaa4a;
  font-size: 1.2rem;
}
.mint-field.multiple-input .mint-cell-title {
  width: 0;
}
</style>