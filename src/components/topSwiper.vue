<template>
  <mt-swipe :auto="4000">
      <mt-swipe-item>
        <div>
          <img class="content" src="../assets/img/home-banner.jpeg" alt="">
        </div>
      </mt-swipe-item>
      <!--<mt-swipe-item>
        <div>
          <img class="content" src="../assets/img/home-banner.jpeg" alt="">
        </div>
      </mt-swipe-item>
      <mt-swipe-item>
        <div>
          <img class="content" src="../assets/img/home-banner.jpeg" alt="">
        </div>
      </mt-swipe-item>-->
    </mt-swipe>
</template>

<script>
export default {
  name: 'topSwiper',
  props: {
      'showSwiper': {
          type: Boolean,
          default: true
      }
  }
}
</script>

<style>
.mint-swipe {
    height: 15.6rem;
  }
  
  .mint-swipe-indicators {
    left: auto;
    right: 1.6rem;
    bottom: 1rem;
    transform: translateX(0);
  }
  
  .mint-swipe-indicator {
    width: .8rem;
    height: .8rem;
    margin: 0 .3rem;
  }
  
  .mint-swipe-item img {
    width: 100%;
  }
</style>
