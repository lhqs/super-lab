<template>
  <div class="academic">
    <div class="top">
      <div class="task">
        <el-card>
          <div class="task-head" slot="header">发布任务</div>
          <div class="task-require">
            <el-form :model="taskList" label-position="right" label-width="80px">
                <el-form-item label="活动名称">
                  <el-col :span="16">
                    <el-input v-model="taskList.taskName" placeholder="请填写名称"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-select v-model="taskList.taskType" placeholder="请选择类型">
                      <el-option label="阅读" value="read"></el-option>
                      <el-option label="写作" value="write"></el-option>
                      <el-option label="实验" value="experiment"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="持续时间">
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择开始日期" v-model="taskList.startDate" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择结束日期" v-model="taskList.endDate" style="width: 100%;"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="指派">
                  <el-select v-model="taskList.memberName" multiple placeholder="请选择成员">
                    <el-option
                      v-for="item in allMember"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="详细内容">
                  <el-input type="textarea" v-model="taskList.describe"></el-input>
                </el-form-item>
                <!--<el-button type="danger" @click="onClearValue">重置</el-button>-->
                <el-button type="primary" @click="onSubmit">发布</el-button>
            </el-form>
          </div>
        </el-card>
      </div>

      <div class="task-list">
        <el-card>
          <div class="task-head" slot="header">任务列表</div>
          <div class="task-table">
            <el-table
              :data="tableList"
              border
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                :index="indexMethod">
              </el-table-column>
              <el-table-column
                prop="username"
                label="成员姓名"
                align="center"
                width="90">
              </el-table-column>
              <el-table-column
                prop="taskName"
                label="任务名称"
                align="center"
                width="100">
              </el-table-column>
              <el-table-column
                prop="taskType"
                label="类型"
                align="center"
                width="60"
                :formatter="typeFormat">
              </el-table-column>
              <el-table-column
                prop="taskDescribe"
                label="描述"
                align="center"
                width="160">
              </el-table-column>
              <el-table-column
                prop="isVerify"
                label="是否确认"
                align="center"
                width="80"
                :formatter="verifyFormat">
              </el-table-column>

              <el-table-column
                prop="progress"
                label="进度"
                align="center"
                width="70"
                :formatter="ProgressFormat">
              </el-table-column>
              <el-table-column
                prop="startDate"
                label="开始日期"
                sortable
                align="center"
                width="140"
                :formatter="formatTime" >
              </el-table-column>
              <el-table-column
                prop="endDate"
                label="结束日期"
                sortable
                align="center"
                width="140"
                :formatter="formatTime" >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                sortable
                align="center"
                width="140"
                :formatter="formatTime" >
              </el-table-column>
              <el-table-column
                prop="producer"
                align="center"
                width="80"
                label="发布者">
              </el-table-column>
              <el-table-column label="操作" align="center" width="160">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleVerify(scope.$index, scope.row)">确认</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="block-page">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 30, 40, 50, 60, 70, 80,90,100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next"
              :total=total>
            </el-pagination>
          </div>

        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAllMember, addTaskList, getTaskList, deleteTaskById, verifyOperate } from '../../api/api'
  import util from '../../utils/utils'
  import { mapGetters } from 'vuex'

  export default {
    name: 'academic',
    data() {
      return {
        taskList: {
          taskName: '',
          taskType: '',
          memberName: [],
          startDate: '',
          endDate: '',
          producer: '',
          describe: ''
        },
        allMember: [],
        tableList: [],
        currentPage: 1,
        total: 10,
        pageNum: 1,
        pageSize: 10
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    mounted() {
      this.fillAllMember()
      this.fillTaskTable()
    },
    methods: {
      onSubmit() {
        const _this = this
        const params = Object.assign({}, this.taskList)
        params.producer = this.name
        addTaskList(params).then(res => {
          console.log('res:', res)
          if (res.data.code === 200) {
            this.$message.success('发布成功')
            _this.fillTaskTable()
          } else {
            this.$message.error('发布失败,请重试')
          }
        })
      },
      fillTaskTable() {
        const _this = this
        const params = { pageNum: this.pageNum, pageSize: this.pageSize }
        getTaskList(params).then(res => {
          _this.total = res.data.data.total
          _this.tableList = res.data.data.list
        })
      },
      handleVerify(index, row) {
        const _this = this
        console.log('verify', row.username, this.name)
        if (row.username !== this.name) {
          this.$message.warning('只有任务所属者才可确认该条记录')
          return
        }
        const param = { taskId: row.taskId }
        verifyOperate(param).then(res => {
          if (res.data.code === 200) {
            _this.fillTaskTable()
            this.$message.success('已确认')
          } else {
            this.$message.error('确认失败,请重试')
          }
        })
      },
      handleDelete(index, row) {
        const _this = this
        if (row.producer !== this.name) {
          this.$message.warning('只有任务发布者才可删除该条记录')
          return
        }
        this.$confirm('此操作将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = { taskId: row.taskId }
          deleteTaskById(param).then(res => {
            _this.fillTaskTable()
            if (res.data.code === 200) {
              this.$message.success('删除成功')
            } else {
              this.$message.error('删除失败,请重试')
            }
          })
        }).catch(() => {
          this.$message('已取消')
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.fillTaskTable()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.fillTaskTable()
      },
      fillAllMember() {
        const _this = this
        getAllMember().then(res => {
          _this.allMember = res.data.data
        })
      },
      indexMethod(index) {
        return index + 1
      },
      formatTime: function(row, column) {
        return util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm')
      },
      verifyFormat: function(value) {
        return value.isVerify === 1 ? '是' : '否'
      },
      typeFormat: function(value) {
        return value.taskType === 'read' ? '阅读' : (value.taskType === 'experiment' ? '实验' : '写作')
      },
      ProgressFormat(value) {
        return value.progress + '%'
      }
    }
  }
</script>

<style scoped>
  .academic {
    margin: auto;
    width: 75%;
  }
  .top {
    margin-top: 20px;
    text-align: center;
  }
  .task-head {
    font-weight: bold;
  }
  .el-select {
    width: 100%;
  }
  .task-list {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .block-page {
    margin-top: 15px;
    margin-bottom: 15px;
    float: right;
  }

</style>
