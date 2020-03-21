<template>
  <div class="container-message">
    <div class="message-title">
      <el-card>
        <div class="message-header" slot="header">消息列表</div>
        <div class="message-content" v-show="!isAdmin">
          <el-table :data="messageData" style="width: 100%">
            <el-table-column label="标签" width="200" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.tagType">{{scope.row.isEmergency | formatterMsgType}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="taskName" label="消息内容" align="center" width="300" :formatter="formatMsgName"></el-table-column>
            <el-table-column prop="taskType" label="消息组" align="center" width="100" :formatter="formatMsgGroup"></el-table-column>

            <el-table-column prop="taskType" label="消息类型" align="center" width="100" :formatter="formatMsgType"></el-table-column>
            <el-table-column label="接收时间" width="200" align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"></i><span style="margin-left: 10px">{{ formatTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="message-content" v-show="isAdmin">
          <div class="user-message" v-show="newUserNum !== 0">有{{newUserNum}}个新用户注册，请尽快分组</div>
          <div class="user-message" v-show="newUserNum === 0">暂无消息</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { getUnreadMsgList, updateReadState, getNewUserNum } from '../../api/api'
  import { mapGetters } from 'vuex'
  import util from '../../utils/utils'

  export default {
    name: 'message',
    data() {
      return {
        messageData: [],
        newUserNum: ''
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'isAdmin'
      ])
    },
    filters: {
      formatterMsgType(value) {
        return value === 0 ? '普通' : '紧急'
      }
    },
    methods: {
      handleEdit(index, row) {
        const _this = this
        const param = { taskId: row.taskId }
        updateReadState(param).then(res => {
          _this.$router.go(0)
          // _this.getUnreadList()
        })
      },
      getUnreadList() {
        const _this = this
        const param = { userId: this.userId }
        getUnreadMsgList(param).then(res => {
          _this.messageData = res.data.data
          for (let i = 0; i < _this.messageData.length; i++) {
            if (_this.messageData[i].isEmergency === 1) {
              _this.messageData[i].tagType = 'danger'
            } else {
              _this.messageData[i].tagType = 'success'
            }
          }
          console.info('_this.messageData', _this.messageData)
        })
      },
      getNewUserCount() {
        const _this = this
        getNewUserNum().then(res => {
          console.log('new: ', res)
          _this.newUserNum = res.data.data
        })
      },
      formatTime: function(createTime) {
        return util.formatDate.format(new Date(createTime), 'yyyy-MM-dd hh:mm')
      },
      formatMsgType: function(row) {
        const maps = { read: '阅读', experiment: '实验', write: '写作', reimbursement: '报销', purchase: '采购', activity: '活动', academic: '学术报告', code: '编码', test: '测试' }
        return maps[row.taskType]
      },
      formatMsgGroup: function(row) {
        if ('write,read,experiment'.indexOf(row.taskType) !== -1) {
          return '科研'
        } else if ('reimbursement,purchase,activity,academic'.indexOf(row.taskType) !== -1) {
          return '日常'
        } else {
          return '项目'
        }
      },
      formatMsgName: function(row) {
        if ('write,read,experiment'.indexOf(row.taskType) !== -1) {
          return '任务名称：' + row.taskName
        } else {
          return '任务名称：' + row.taskName
        }
      }
    },
    created() {
      this.getUnreadList()
      this.getNewUserCount()
    }
  }
</script>

<style scoped>
  .container-message {
    margin: auto;
    width: 70%;
  }
  .message-title {
    margin-top: 20px;
  }
  .message-header{
    text-align: center;
    font-weight: bold;
  }
</style>
