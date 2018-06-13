<template>
  <div class="dashboard-container">
    <!--<div class="dashboard-text">name:{{name}}</div>
    <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>-->
    <!--<div align="center" class="main">这里是实验室交流系统主页</div>-->

    <el-card class="user-info">
      <div class="user-title" slot="header">
        <span>个人信息</span>
        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
      </div>
      <div class="user-content">
        <img class="user-avatar" :src="avatar">
        <div><span>性别: {{sex}}</span><span> 修改 </span> </div>
        <div><span>登入名称：{{}}</span><span> 修改 </span> </div>
        <div><span>电话: {{mobile}}</span><span> 绑定 </span> </div>
        <div><span>邮箱：{{}}</span><span> 绑定 </span> </div>
        <div>修改时间：{{}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'avatar',
      'sex',
      'userId',
      'mobile'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .main {
    font-size: 24px;
  }
  .user-info {
    /*width: 480px;*/
  }
  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 100px;
  }
</style>
