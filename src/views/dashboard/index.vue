<template>
  <div class="dashboard-container">
    <div class="lab-info">
      <el-card>
        <div class="lab-title" slot="header">实验室logo</div>
        <div class="lab-content">
          <div class="lab-logo"><img src="http://qiniu.lhqs1314.cn/file/lab/super_lab_logo.png" alt="超计算实验室logo"></div>
        </div>
      </el-card>
    </div>

    <div class="lab-info">
      <el-card>
        <div class="lab-title" slot="header">实验室介绍</div>
        <div class="lab-content">
          <div class="lab-description">超计算实验室，成立于2018年，致力于研究XXX。</div>
        </div>
      </el-card>
    </div>

    <div class="group-info">
      <el-card>
        <div class="lab-title" slot="header">团队成员</div>
        <div class="team-content">
          <div>XXX，女，XXX, 主要负责XXX, 作品有XXX</div>
          <div>XXX，男，XXX，主要负责XXX, 作品有XXX</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard'

}
</script>

<style scoped>
  .dashboard-container {
    margin: auto;
    width: 50%;
  }
  .lab-title {
    font-weight: bold;
    text-align: center;
  }
  .lab-logo {
    text-align: center;
  }
  .lab-description {
    margin: 10px 0 10px 0;
  }
  .lab-info  {
    margin-top: 40px;
  }
  .group-info {
    margin-top: 40px;
    margin-bottom: 20px
  }
  .team-content{
    line-height: 26px;
  }
</style>
