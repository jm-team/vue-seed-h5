import Vue from 'vue'
import Router from 'vue-router'

// 引入路由视图

import wxAccredit from 'views/wxAccredit'
import home from 'views/gx'
import gxBaomin from 'views/gxBaomin'
import gxBaoshu from 'views/gxBaoshu'
import gxHuixiang from 'views/gxHuixiang'
import gxGongke from 'views/gxGongke'
import gxGongkeList from 'views/gxGongkeList'

import noticeDetail from 'views/notice'
import fangSheng from 'views/fangSheng'
import foShi from 'views/foShi'

import me from 'views/me'
import meGongxiu from 'views/meGongxiu'
import meGongxiuList from 'views/meGongxiuList'
import meHuixiang from 'views/meHuixiang'
import meProfile from 'views/meProfile'

import page404 from 'views/page404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
      {
    path: '/',
    name: 'wxAccredit',
    component: wxAccredit
  },
      {
    path: '/home',
    query: {code:''},
    name: 'gongXiu',
    component: home
  }, {
    path: '/notice/:id',
    name: 'noticeDetail',
    component: noticeDetail
  }, {
    path: '/gx/baomin',
    name: 'gxBaomin',
    component: gxBaomin
  }, {
    path: '/gx/baoshu',
    name: 'gxBaoshu',
    component: gxBaoshu,
    beforeEnter: (to, from, next) => {
      let animationDuration = 20;
      addDynamicStyle(animationDuration);

      function addDynamicStyle(animationDuration) {
        var css = `.barrage-enter-active {
              animation: moving ${animationDuration}s linear;
            }`,
        head = document.head || document.getElementsByTagName('head')[0],
        sheet = document.createElement('style');
        sheet.id = 'barrage-enter-active';
        sheet.innerHTML = css;
        head.appendChild(sheet);
      }

      next();
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      var sheetToBeRemoved = document.getElementById('barrage-enter-active');
      if (sheetToBeRemoved) {
        var sheetParent = sheetToBeRemoved.parentNode;
        sheetParent.removeChild(sheetToBeRemoved);
      }

      next();
    }
  }, {
    path: '/gx/huixiang',
    name: 'gxHuixiang',
    component: gxHuixiang
  }, {
    path: '/gx/gongke',
    name: 'gxGongke',
    component: gxGongke
  }, {
    path: '/gx/gongke/list/:id',
    name: 'gxGongkeList',
    component: gxGongkeList
  }, {
    path: '/fs',
    name: 'fangSheng',
    component: fangSheng
  }, {
    path: '/foshi',
    name: 'foShi',
    component: foShi
  }, {
    path: '/me',
    name: 'me',
    component: me
  }, {
    path: '/me/gongxiu',
    name: 'meGongxiu',
    component: meGongxiu
  }, {
    path: '/me/gongxiu/list/:id',
    name: 'meGongxiuList',
    component: meGongxiuList
  }, {
    path: '/me/huixiang',
    name: 'meHuixiang',
    component: meHuixiang
  }, {
    path: '/me/profile',
    name: 'meProfile',
    component: meProfile
  }, {
    path: '*',
    component: page404
  }]
})