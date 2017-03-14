<template>
  <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="right" class="popup-dialog" :modal="false">
    <span class="icon-baomin-success"></span>
    <h3>{{dialog.title}}</h3>
    <p>{{dialog.subTitle}}</p>
    <div class="button-group">
      <slot>
      </slot>
    </div>
  </mt-popup>
</template>
<script>
  export default {
    name: 'successFullscreenDialog',
    props: {
      'popupVisible': {
        type: Boolean,
        default: false
      },
      'dialog': {
        type: Object,
        default: function () {
          return {
            title: '',
            subTitle: ''
          }
        }
      }
    },
    methods: {
      closeMe: function () {
        this.$emit('closeMe')
      }
    }
  }
</script>
<style>
  .popup-dialog {
    width: 100%;
    height: 100%;
    background-color: #fff;
    text-align: center;
  }
  
  .popup-dialog h3 {
    margin: 2.4rem 0 1.5rem;
    font-size: 2rem;
  }
  
  .popup-dialog p {
    margin-bottom: 3.8rem;
    font-size: 1.2rem;
  }
  
  .icon-baomin-success {
    margin-top: 7.5rem;
    display: inline-block;
    width: 5.4rem;
    height: 5.4rem;
    background: url(../assets/img/icon-ok.png) no-repeat center center;
    background-size: 5.4rem 5.4rem;
  }
</style>