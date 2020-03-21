<template>
  <div class="talk">
    <div class="top">
      <!--<el-card>
        <div class="record-title">任务记录</div>
      </el-card>-->
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
                <el-date-picker type="date" v-model="value.startDate"></el-date-picker>
              </el-col>
              <el-col :span="12">
                <el-date-picker type="date" v-model="value.endDate"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="详细内容">
              <el-input type="textarea" v-model="value.taskDescribe"></el-input>
            </el-form-item>
            <el-form-item label="地点" v-show="value.taskType === '采购' | value.taskType === '报账'| value.taskType === '活动' | value.taskType === '学术报告'">
              <el-input v-model="value.address"></el-input>
            </el-form-item>
            <el-form-item label="预算" v-show="value.taskType === '采购' | value.taskType === '报账'| value.taskType === '活动' | value.taskType === '学术报告'">
              <el-input  v-model="value.budget"></el-input>
            </el-form-item>
            <el-form-item label="调节进度">
              <el-slider v-model="value.progress" @change="progressChange(value.progress, value.taskId)" show-input></el-slider>
            </el-form-item>
            <el-form-item label="反馈信息">
              <el-col :span="18"><el-input type="textarea" v-model="value.feedbackMessage" placeholder="请添加你的反馈信息"></el-input></el-col><el-col :span="1">&nbsp</el-col>
              <el-col :span="5"><el-button size="small" type="success" @click="addFeedbackMsg(value.feedbackMessage,value.taskId)">确认添加</el-button></el-col>
            </el-form-item>
            <el-form-item label="上传附件" v-show="value.taskType === '写作' | value.taskType === '实验'| value.taskType === '阅读'">
              <el-upload ref="upload" action="" :http-request="customUpload" :file-list="fileList" :limit="1" :multiple="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button  size="small" type="success" @click="uploadSubmit(value.taskId)">提交记录</el-button>
              </el-upload>
            </el-form-item>

            <div class="table-edit" v-show="value.taskType === '采购'">
              <el-button type="primary" @click="dialogPurchaseVisible = true">填写采购单</el-button>
            </div>
            <div class="table-edit" v-show="value.taskType === '报销'">
              <el-button type="primary" @click="dialogReimVisible = true">填写报销单</el-button>
            </div>
          </el-form>
        </el-card>
      </div>

      <el-dialog title="填写采购单"  :visible.sync="dialogPurchaseVisible">
        <el-form ref="purchaseForm" :model="purchaseForm" label-width="80px">
          <el-form-item label="项目说明">
            <el-input type="textarea" v-model="purchaseForm.projectIllustration"></el-input>
          </el-form-item>
          <el-form-item label="采购项目">
            <el-input v-model="purchaseForm.purchaseType"></el-input>
          </el-form-item>
          <el-form-item label="费用">
            <el-input v-model="purchaseForm.amount"></el-input>
          </el-form-item>
          <el-form-item label="事由">
            <el-input type="textarea" v-model="purchaseForm.incident"></el-input>
          </el-form-item>
          <el-form-item label="经承人">
            <el-input v-model="purchaseForm.takeOver"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="submit-button"><el-button type="primary" @click="createPurchase">立即创建</el-button></div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="填写报销单"  :visible.sync="dialogReimVisible">
        <el-form ref="reimForm" :model="reimForm" label-width="80px">
          <el-form-item label="项目说明">
            <el-input type="textarea" v-model="reimForm.projectIllustration"></el-input>
          </el-form-item>
          <el-form-item label="报销类目">
            <el-input v-model="reimForm.reimbursementType"></el-input>
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="reimForm.amount"></el-input>
          </el-form-item>
          <el-form-item label="事由">
            <el-input type="textarea" v-model="reimForm.incident"></el-input>
          </el-form-item>
          <el-form-item label="经承人">
            <el-input v-model="reimForm.takeOver"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="submit-button"><el-button type="primary" @click="createReim">立即创建</el-button></div>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import { getTaskRecord, renewProgress, insertFeedbackMsg, addPurchaseSheet, addReimSheet, uploadFileRecord } from '../../api/api'
  import { mapGetters } from 'vuex'
  import { uploadFile } from '../../api/upload'

  export default {
    name: 'mytalk',
    data() {
      return {
        progress: 0,
        taskRecords: {},
        fileList: [],
        dialogPurchaseVisible: false,
        dialogReimVisible: false,
        fileUrl: '',
        purchaseForm: {},
        reimForm: {},
        uploadFileUrl: ''
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
      formatTaskType(value) {
        const maps = { read: '阅读', experiment: '实验', write: '写作', reimbursement: '报销', purchase: '采购', activity: '活动', academic: '学术报告' }
        return maps[value]
      },
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
      },
      addFeedbackMsg(value, taskId) {
        const params = { taskId: taskId, feedbackMsg: value }
        insertFeedbackMsg(params).then(res => {
          console.log('insertMsg', res)
          if (res.data.code === 200) {
            this.$message.success('添加成功')
          } else {
            this.$message.error('添加失败')
          }
        })
      },
      createPurchase() {
        const _this = this
        const params = Object.assign({ userId: this.userId, createTime: new Date() }, this.purchaseForm)
        addPurchaseSheet(params).then(res => {
          if (res.data.code === 200) {
            _this.dialogPurchaseVisible = false
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
        })
      },
      createReim() {
        const _this = this
        const params = Object.assign({ userId: this.userId, createTime: new Date() }, this.reimForm)
        addReimSheet(params).then(res => {
          if (res.data.code === 200) {
            _this.dialogReimVisible = false
            this.$message.success('成功')
          } else {
            this.$message.error('失败')
          }
        })
      },
      customUpload: function(param) {
        const fileData = new FormData()
        fileData.append('file', param.file)
        const _this = this
        uploadFile(fileData).then((res) => {
          if (res.code === 200) {
            _this.uploadFileUrl = res.data.fileUrl
            _this.uploadFileName = res.data.content
            this.$message.success('上传成功')
          } else {
            this.$message.error('更新失败')
          }
        })
      },
      uploadSubmit(taskId) {
        if (this.uploadFileUrl === '') {
          this.$message.warning('未选取文件或者正在上传中')
          return
        }
        const params = { taskId: taskId, fileUrl: this.uploadFileUrl, fileName: this.uploadFileName }
        console.log('sub_params: ', params)
        uploadFileRecord(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('提交成功')
          } else {
            this.$message.error('提交失败')
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
  .table-edit,.submit-button {
    text-align: center;
  }
</style>
