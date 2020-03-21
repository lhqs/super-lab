<template>
  <div class="dashboard-container">
    <div class="lab-info">
        <div class="lab-content">
          <div class="lab-logo"><img class="img-style" src="http://qiniu.lhqs1314.cn/file/lab/experiment_lab_logo.png" alt="超计算实验室logo"></div>
        </div>
    </div>

    <!--<div class="lab-info">
      <el-card>
        <div class="lab-title" slot="header">实验室介绍</div>
        <div class="lab-content">
          <div class="lab-description">超感知计算实验室，成立于2018年，致力于研究XXX。</div>
        </div>
      </el-card>
    </div>-->

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
  .img-style {
    width: 160px;
    height: 160px;
  }
</style>
