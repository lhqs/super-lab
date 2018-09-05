<template>
  <div class="test">
    <div class="one">
      <a href="http://qiniu.lhqs1314.cn/file/lab/theyelldow.jpg" target="_top">download</a>
    </div>

    <div class="two">
      <button @click="alertTip">click me</button>
    </div>

    <!--<div>
      <form action="http://localhost:9099/api/upload/uploadHandle"
            method="post"
            enctype="multipart/form-data">
        文件:<input type="file" name="file"/>
        <input type="submit" value="上传"/>
      </form>
    </div>-->

  </div>
</template>


<style>
  .test {
    margin: auto;
    width: 50%;
  }
  .one {
    margin-top: 20px;
  }
  .two {
    margin-top: 20px;
  }
</style>

<script>
  export default {
    data() {
      return {
        fileList: []
      }
    },
    methods: {
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      alertTip() {
        this.$message.success('tips')
      }
    }
  }
</script>
