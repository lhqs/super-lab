<template>
  <div class="top">
    <div class="title">{{title}}</div>
    <div class="input-content">
      <el-input type="textarea" v-model="share" :placeholder="placeholder" rows="4"></el-input>
    </div>
    <div class="submit-button">
      <el-button type="primary" @click="onReset">清除</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
    <div class="list">
      <div class="list-show">
        list表
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'show',
    data() {
      return {
        title: '你有什么想要分享的',
        share: '',
        placeholder: '请在这里写下你的故事'
      }
    },
    methods: {
      getShowList() {
        console.log('show', 'show')
      }
    }
  }
</script>

<style scoped>
  .top {
    margin:auto;
    width:50%;
  }
  .title {
    margin-top: 15px;
  }

  .input-content {
    text-align: center;
    margin:10px 0px 10px 0px;
  }

  .submit-button{
    float: right;
  }

  .list {
    clear: both;
  }

</style>
