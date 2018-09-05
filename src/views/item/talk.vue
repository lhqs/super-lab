<template>
  <div class="talk">
    <div class="top">
      <el-card>
        <div class="record-title">任务记录</div>
      </el-card>

      <div class="task-record" v-for="value in taskRecords">
        <el-card>
          <el-form :model="value" label-position="right" label-width="80px">
            <el-form-item label="活动名称">
              <el-col :span="16">
                <el-input v-model="value.taskName"></el-input>
              </el-col>
              <el-col :span="8">
                <el-input v-model="value.taskType"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="持续时间">
              <el-col :span="12">
                <el-date-picker type="date" v-model="value.startDate" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col :span="12">
                <el-date-picker type="date" v-model="value.endDate" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="详细内容">
              <el-input type="textarea" v-model="value.taskDescribe"></el-input>
            </el-form-item>
            <el-form-item label="调节进度">
                <el-slider
                  v-model="value.progress" @change="progressChange(value.progress, value.taskId)"
                  show-input>
                </el-slider>
            </el-form-item>
          </el-form>
        </el-card>

      </div>

    </div>
  </div>
</template>

<script>
  import { getTaskRecord, renewProgress } from '../../api/api'
  import { mapGetters } from 'vuex'

  export default {
    name: 'talk',
    data() {
      return {
        progress: 0,
        taskRecords: {}
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    mounted() {
      this.acquiretaskList()
    },
    methods: {
      acquiretaskList() {
        const _this = this
        const param = { userId: this.userId }
        getTaskRecord(param).then(res => {
          _this.taskRecords = res.data.data
        })
      },
      progressChange(value, taskId) {
        const params = { taskId: taskId, progress: value }
        renewProgress(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('成功更新进度')
          } else {
            this.$message.error('更新进度失败，请重试')
          }
        })
      }
    }
  }
</script>

<style scoped>
  .talk {
    margin: auto;
    width: 50%;
  }
  .top {
    margin-top: 20px;
  }
  .record-title {
    text-align: center;
    font-weight: bold;
  }
  .task-record {
    margin-top: 20px
  }
</style>
