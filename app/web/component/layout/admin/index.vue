<template>
   <div class='main admin'>
     <div v-if="$route.meta.noAll" class="jing-main">
       <router-view></router-view>
     </div>
     <div v-else>
      <LayoutHeader></LayoutHeader>
      <LayoutContent>
        <div slot='content'><slot name='main'></slot></div>
      </LayoutContent>
     </div>
     
   </div>
</template>
<style>
 @import '../../../asset/css/global.css';
 @import './index.css';
</style>
<script type='babel'>
  import LayoutHeader from './header/header';
  import LayoutContent from './content/content';
  export default {
    components: {
      LayoutHeader,
      LayoutContent
    }
  };
</script>

<style lang="less" scoped>
  .jing-main{
    width: 100%;
    padding: 20px;
  }
</style>