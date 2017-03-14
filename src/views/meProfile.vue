<template>
  <div>
    <div class="banner">
      <img src="../assets/img/home-banner.jpg" alt="">
    </div>
    <form class="me-profile-form" @submit.prevent="validateBeforeSubmit">
      <mt-cell title="姓名" class="mint-field " :class="{ 'is-danger': errors.has('personName') }">
        <input class="mint-field-core" name="personName" v-model="memberObj.personName" v-validate:personName.initial="'required|max:10'"
          :class="{'input': true, 'is-danger': errors.has('personName') }" type="text" placeholder="您的姓名">
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('personName')" :class="{ 'valid-alert': errors.has('personName') }">
          <span class="help is-danger">{{ errors.first('personName') }}</span>
        </mt-cell>
      </transition>
      <mt-cell title="法号/昵称" class="mint-field " :class="{ 'is-danger': errors.has('alias') }">
        <input class="mint-field-core" name="alias" v-model="memberObj.alias" v-validate:personName.initial="'required|max:10'" :class="{'input': true, 'is-danger': errors.has('alias') }"
          type="text" placeholder="您的法号或昵称">
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('alias')" :class="{ 'valid-alert': errors.has('alias') }">
          <span class="help is-danger">{{ errors.first('alias') }}</span>
        </mt-cell>
      </transition>
      <mt-cell title="手机号码" class="mint-field" :class="{ 'is-danger': errors.has('personMobile') }">
        <input class="mint-field-core" name="personMobile" v-model="memberObj.personMobile" v-validate:personMobile.initial="{ rules: { regex: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/, required: true, numeric: true } }"
          :class="{'input': true, 'is-danger': errors.has('personMobile') }" type="tel" placeholder="您的手机号码">
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('personMobile')" :class="{ 'valid-alert': errors.has('personMobile') }">
          <span class="help is-danger">{{ errors.first('personMobile') }}</span>
        </mt-cell>
      </transition>
      <mt-cell title="性别" class="mint-field">
        <select class="gx-download-select mint-field-core" v-model="memberObj.gender">
      <option value=""></option>
      <option value="1">男</option>
      <option value="2">女</option>
    </select>
      </mt-cell>
      <mt-cell title="职务" class="mint-field">
        <select class="gx-download-select mint-field-core" v-model="memberObj.nature">
      <option value=""></option>
      <option value="1">僧众</option>
      <option value="2">在家众</option>
            <option value="3">团体</option>
    </select>
      </mt-cell>
      <mt-cell title="地址" class="mint-field">
        <p class="gx-download-select mint-field-core" @click="popupAddressDialog = true">{{address}}</p>
      </mt-cell>
      <mt-cell class="mint-field multiple-input" :class="{ 'is-danger': errors.has('address') }">
        <textarea class="mint-field-core" rows="4" name="address" v-model="memberObj.address" v-validate:remark.initial="'max:500'"
          :class="{'input': true, 'is-danger': errors.has('address') }" type="text" placeholder="您的详细地址"></textarea>
      </mt-cell>
      <transition name="valid-help">
        <mt-cell v-show="errors.has('address')" :class="{ 'valid-alert': errors.has('address') }">
          <span class="help is-danger">{{ errors.first('address') }}</span>
        </mt-cell>
      </transition>
      <mt-button class="btn-submit">保存资料</mt-button>
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
    <mt-popup v-model="popupAddressDialog" position="bottom" class="address-picker-wrapper">
      <div>
        <div class="picker-toolbar clear">
          <span class="address-cancel fn-left" @click="popupAddressDialog = false">取消</span>
          <span class="address-confirm fn-right" @click="popupAddressDialog = false">确定</span>
        </div>
        <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
      </div>
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
        numeric: (field) => ` ${field} 只能包含数字。`,
      }),
      attributes: {
        personName: '姓名',
        alias: '法号/昵称',
        personMobile: '手机号码',
        address: '地址'
      }
    }
  });

  //var defaultProvinceIndex = 0;

  export default {
    created() {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.getUserInfo();

      this.$validator.setLocale('zh_CN');

      this.getMyProfile();

    },
    methods: {
      getUserInfo() {
        var userInfo = localStorage.userInfo;
        this.userInfo = Object.assign({}, JSON.parse(userInfo));
        
        var provinceCode = this.userInfo.provinceCode || '北京'; 
        var cityCode = this.userInfo.cityCode || '北京'; 
        this.addressProvince = provinceCode;
        this.addressCity = cityCode;
        console.log(this.addressProvince + ':' + this.addressCity);
    
      },
      validateBeforeSubmit() {
        // Validate All returns a promise and provides the validation result.
        this.$validator.validateAll().then(success => {
          if (!success) {
            // handle error
            return;
          }
          this.saveMyProfile();
        }).catch(() => {
          // It has failed.
        });
      },
      goHome() {
        this.$router.push('/home')
      },
      // 获取个人信息
      getMyProfile() {
        this.memberObj = Object.assign({}, this.userInfo);
      },
      // 修改个人信息
      saveMyProfile() {
        this.error = null
        this.loading = true
        var userId = this.userInfo.id;
        var vm = this;
        this.axios.put(`/api/front/members`, vm.memberObj).then((resp) => {
          vm.loading = false
          var userInfo = Object.assign({},vm.userInfo, {
            address: vm.memberObj.address,
            alias: vm.memberObj.alias,
            cityCode: vm.memberObj.cityCode,
            gender: vm.memberObj.gender,
            nature: vm.memberObj.nature,
            provinceCode: vm.memberObj.provinceCode,
            personName: vm.memberObj.personName,
            personMobile: vm.memberObj.personMobile
          })
//          vm.$parent.Public.Cookie.setCookie('userInfo', JSON.stringify(userInfo));
            localStorage.userInfo=JSON.stringify(userInfo)
          vm.popupSuccessMessage = true;
        }).catch(function (error) {
          vm.loading = false
          vm.popupFailedMessage = true;
        });
      },
      onAddressChange(picker, values) {
        console.dir(values);
        picker.setSlotValues(1, address[values[0]]);
        this.addressProvince = values[0];
        this.addressCity = values[1];
      }
    },
    components: {
      successFullscreenDialog
    },
    computed: {
      // a computed getter
      address: function () {
        // `this` points to the vm instance
        this.memberObj.cityCode = this.addressCity
        this.memberObj.provinceCode = this.addressProvince
        return this.addressProvince + ' ' + this.addressCity
      }
    },
    data() {
      return {
        loading: false,
        error: null,
        userInfo: {},
        popupSuccessMessage: false,
        popupFailedMessage: false,
        popupAddressDialog: false,
        successDialogObj: {
          title: '保存成功!',
          subTitle: '阿弥陀佛! 感恩师兄!'
        },
        memberObj: {},
        addressSlots: [{
          flex: 1,
          values: Object.keys(address),
          className: 'slot1',
          textAlign: 'center'
        }, {
          divider: true,
          content: '-',
          className: 'slot2'
        }, {
          flex: 1,
          values: ['北京'],
          className: 'slot3',
          textAlign: 'center'
        }],
        addressProvince: '北京',
        addressCity: '北京'
      }
    }
  }

  const address = {
    '北京': ['北京'],
    '广东': ['广州', '深圳', '珠海', '汕头', '韶关', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山',
      '潮州', '揭阳', '云浮'
    ],
    '上海': ['上海'],
    '天津': ['天津'],
    '重庆': ['重庆'],
    '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
    '江苏': ['南京', '苏州', '无锡', '常州', '镇江', '南通', '泰州', '扬州', '盐城', '连云港', '徐州', '淮安', '宿迁'],
    '湖北': ['武汉', '黄石', '十堰', '荆州', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '黄冈', '咸宁', '随州', '恩施土家族苗族自治州', '仙桃', '天门', '潜江',
      '神农架林区'
    ],
    '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中',
      '资阳', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'
    ],
    '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
    '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
    '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
    '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店'],
    '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边朝鲜族自治州'],
    '黑龙江': ['哈尔滨', '齐齐哈尔', '鹤岗', '双鸭山', '鸡西', '大庆', '伊春', '牡丹江', '佳木斯', '七台河', '黑河', '绥化', '大兴安岭地区'],
    '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '锡林郭勒盟', '兴安盟', '阿拉善盟'],
    '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'],
    '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城'],
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
    '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西土家族苗族自治州'],
    '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
    '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
    '贵州': ['贵阳', '六盘水', '遵义', '安顺', '铜仁地区', '毕节地区', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
    '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州', '大理白族自治州', '楚雄彝族自治州',
      '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州'
    ],
    '西藏': ['拉萨', '那曲地区', '昌都地区', '林芝地区', '山南地区', '日喀则地区', '阿里地区'],
    '海南': ['海口', '三亚', '五指山', '琼海', '儋州', '文昌', '万宁', '东方', '澄迈县', '定安县', '屯昌县', '临高县', '白沙黎族自治县', '昌江黎族自治县',
      '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'
    ],
    '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '酒泉', '张掖', '庆阳', '平凉', '定西', '陇南', '临夏回族自治州', '甘南藏族自治州'],
    '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
    '青海': ['西宁', '海东地区', '海北藏族自治州', '海南藏族自治州', '黄南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
    '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番地区', '哈密地区', '和田地区', '阿克苏地区', '喀什地区', '克孜勒苏柯尔克孜自治州', '巴音郭楞蒙古自治州', '昌吉回族自治州',
      '博尔塔拉蒙古自治州', '石河子', '阿拉尔', '图木舒克', '五家渠', '伊犁哈萨克自治州'
    ],
    '香港': ['香港'],
    '澳门': ['澳门'],
    '台湾': ['台北市', '高雄市', '台北县', '桃园县', '新竹县', '苗栗县', '台中县', '彰化县', '南投县', '云林县', '嘉义县', '台南县', '高雄县', '屏东县', '宜兰县',
      '花莲县', '台东县', '澎湖县', '基隆市', '新竹市', '台中市', '嘉义市', '台南市'
    ]
  };
</script>
<style>
  .banner {
    height: 15.6rem;
  }
  
  .banner img {
    width: 100%;
  }
  
  .me-profile-form {
    padding: 0 1.5rem;
  }
  
  .me-profile-form .mint-cell-wrapper {
    padding: 0;
    font-size: 1.2rem;
  }
  
  .me-profile-form .mint-cell:first-child .mint-cell-wrapper {
    background-image: none;
  }
  
  .gx-download-select {
    width: 100%;
    -webkit-appearance: none;
    border: none;
    outline: 0;
    background: url(../assets/img/arrow-down.png) no-repeat right center;
    background-size: 1.5rem 1.5rem;
  }
  
  .me-profile-form textarea {
    min-height: 8.5rem;
    margin-top: .5rem;
    border: .1rem solid #eaeaea;
    background: #f7f7f8;
    border-radius: .3rem;
  }
  
  .me-profile-form .btn-submit {
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
  
  .address-picker-wrapper {
    width: 100%;
  }
  
  .address-picker-wrapper .picker-toolbar {
    border-bottom: solid 1px #eaeaea;
  }
  
  .address-picker-wrapper .address-cancel,
  .address-picker-wrapper .address-confirm {
    display: inline-block;
    width: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    color: #26a2ff;
  }
  
  .address-picker-wrapper .picker-slot {
    font-size: 1.4rem;
  }
</style>