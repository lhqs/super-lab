<template>
  <div class="daily">
    <div class="top">
      <div v-show="isAdmin == 1">
        <div class="task">
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="说明" name="first">
              说明： 请在右侧tab标签进行任务发布与任务反馈操作
            </el-tab-pane>
            <el-tab-pane label="发布任务" name="second">
              <div class="task-require">
                <el-form :model="taskList" label-position="right" label-width="80px">
                  <el-form-item label="活动名称">
                    <el-col :span="16">
                      <el-input v-model="taskList.taskName" placeholder="请填写名称"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-select v-model="taskList.taskType" placeholder="请选择类型">
                        <el-option label="采购" value="purchase"></el-option>
                        <el-option label="报账" value="reimbursement"></el-option>
                        <el-option label="活动" value="activity"></el-option>
                        <el-option label="学术报告" value="academic"></el-option>
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
                  <el-form-item label="地点">
                    <el-input v-model="taskList.address" placeholder="请填写地点"></el-input>
                  </el-form-item>
                  <el-form-item label="预算">
                    <el-input v-model="taskList.budget" placeholder="请填写预算"></el-input>
                  </el-form-item>
                  <el-form-item label="内容说明">
                    <el-input type="textarea" v-model="taskList.describe"></el-input>
                  </el-form-item>
                  <el-form-item label="是否紧急">
                    <el-radio-group v-model="taskList.isEmergency">
                      <el-radio label=1>是</el-radio>
                      <el-radio label=0>否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="实验组">
                    <el-checkbox-group v-model="taskList.memberName">
                      <el-checkbox v-for="item in userGroupForScience" :key="item.value" :label="item.label">
                        <img class="user-avatar" :src="item.avatar">{{item.label}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="项目组">
                    <el-checkbox-group v-model="taskList.memberName">
                      <el-checkbox v-for="item in userGroupForProject" :key="item.value" :label="item.label">
                        <img class="user-avatar" :src="item.avatar">{{item.label}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="管理组">
                    <el-checkbox-group v-model="taskList.memberName">
                      <el-checkbox v-for="item in userGroupForManager" :key="item.value" :label="item.label">
                        <img class="user-avatar" :src="item.avatar">{{item.label}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-button type="primary" @click="onSubmit">发布</el-button>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="任务反馈" name="third">
              <el-table :data="feedbackSheet" border stripe style="width: 100%">
                <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="username" label="成员姓名" align="center" width="90"></el-table-column>
                <el-table-column prop="taskName" label="任务名称" align="center" width="100"></el-table-column>
                <el-table-column prop="taskType" label="类型" align="center" width="60" :formatter="typeFormat"></el-table-column>
                <el-table-column prop="feedbackMessage" label="反馈信息" align="center" width="340"></el-table-column>
                <el-table-column prop="feedbackFilename" label="反馈文件" align="center" width="180"></el-table-column>
                <el-table-column prop="feedbackUrl" label="下载文件" align="center" width="100">
                  <template slot-scope="scope">
                    <a :href="scope.row.feedbackUrl"><el-button size="mini" :disabled="scope.row.feedbackUrl === null">下载</el-button></a>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable  align="center"  width="140" :formatter="formatTime" ></el-table-column>
                <el-table-column label="进度" align="center" width="200">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress"></el-progress>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block-page">
                <el-pagination background @size-change="handleSizeChangeSheet" @current-change="handleCurrentChangeSheet" :current-page="currentPageSheet"
                               :page-sizes="[5, 10, 20, 30, 40, 50, 60, 70, 80,90,100]" :page-size="10" layout="total, sizes, prev, pager, next" :total=sheetTotal>
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="报销单" name="four">
              <el-table :data="reimSheet" border stripe style="width: 100%">
                <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="username" label="姓名" align="center" width="100"></el-table-column>
                <el-table-column prop="projectIllustration" label="项目说明" align="center" width="340"></el-table-column>
                <el-table-column prop="reimbursementType" label="报销类目" align="center" width="80"></el-table-column>
                <el-table-column prop="amount" label="金额" align="center" width="120"></el-table-column>
                <el-table-column prop="incident" label="事由" align="center" width="340"></el-table-column>
                <el-table-column prop="takeOver" label="接手人" align="center" width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable  align="center"  width="140" :formatter="formatTime" ></el-table-column>
              </el-table>
              <el-row>
                <el-col :span="8" class="block-export">
                  <el-button size="small" type="primary" @click="exportReim">导出至Excel</el-button>
                </el-col>
                <el-col :span="16"  class="block-page">
                  <el-pagination background @size-change="handleSizeChangeReim" @current-change="handleCurrentChangeReim" :current-page="reimCurrentPage"
                          :page-sizes="[5, 10, 20, 30, 40, 50, 60, 70, 80]" :page-size="10" layout="total, sizes, prev, pager, next" :total=reimTotal>
                  </el-pagination>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="采购单" name="five">
              <el-table :data="purchaseSheet" border stripe style="width: 100%">
                <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="username" label="姓名" align="center" width="100"></el-table-column>
                <el-table-column prop="projectIllustration" label="项目说明" align="center" width="340"></el-table-column>
                <el-table-column prop="purchaseType" label="采购项目" align="center" width="80"></el-table-column>
                <el-table-column prop="amount" label="费用" align="center" width="120"></el-table-column>
                <el-table-column prop="incident" label="事由" align="center" width="340"></el-table-column>
                <el-table-column prop="takeOver" label="接手人" align="center" width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable  align="center"  width="140" :formatter="formatTime" ></el-table-column>
              </el-table>
              <el-row>
                <el-col :span="8" class="block-export">
                  <el-button size="small" type="primary" @click="exportPurchase">导出至Excel</el-button>
                </el-col>
                <el-col :span="16"  class="block-page">
                <el-pagination background @size-change="handleSizeChangePurchase" @current-change="handleCurrentChangePurchase" :current-page="purchaseCurrentPage"
                               :page-sizes="[5, 10, 20, 30, 40, 50, 60, 70, 80]" :page-size="10" layout="total, sizes, prev, pager, next" :total=purchaseTotal>
                </el-pagination>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="task-list">
        <el-tabs v-model="activeTaskList" type="border-card" @tab-click="handleTableClick">
          <el-tab-pane label="任务列表（进行中）" name="first">
            <div class="task-table">
              <div class="search-box">
                <div class="search-detail">
                  <el-col :span="10">
                    <el-input v-model="taskConsumer" placeholder="请输入要查找的任务所属者"></el-input>
                  </el-col>
                  <el-col :span="1">
                    &nbsp
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="taskProducer" placeholder="请输入要查找的任务发布者"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button @click="taskSearch">搜索</el-button>
                  </el-col>
                </div>
              </div>
              <el-table :data="tableList" border stripe style="width: 100%">
                <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="username" label="成员姓名" align="center" width="90"></el-table-column>
                <el-table-column prop="taskName" label="任务名称" align="center" width="100"></el-table-column>
                <el-table-column prop="taskType" label="类型" align="center" width="60" :formatter="typeFormat"></el-table-column>
                <el-table-column prop="taskDescribe" label="描述" align="center" width="160"></el-table-column>
                <el-table-column label="是否紧急" align="center" width="80">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.isEmergency"></i>
                    <i class="el-icon-close" v-else="scope.row.isEmergency"></i>
                  </template>
                </el-table-column>
                <el-table-column label="是否确认" align="center" width="80">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.isVerify"></i>
                    <i class="el-icon-close" v-else="scope.row.isVerify"></i>
                  </template>
                </el-table-column>
                <el-table-column label="进度" align="center" width="200">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column prop="startDate" label="开始日期" sortable align="center" width="140" :formatter="formatTime" ></el-table-column>
                <el-table-column prop="endDate" label="结束日期" sortable align="center" width="140" :formatter="formatTime" ></el-table-column>
                <!--<el-table-column prop="createTime" label="创建时间" sortable  align="center"  width="140" :formatter="formatTime" ></el-table-column>-->
                <el-table-column prop="producer" align="center" width="80" label="发布者"></el-table-column>
                <el-table-column label="操作" align="center" width="160">
                  <template slot-scope="scope">
                    <!--<el-button size="mini" type="primary" :disabled="scope.row.isVerify === 1" @click="handleVerify(scope.$index, scope.row)">确认</el-button>-->
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="block-page">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                             :page-sizes="[5, 10, 20, 30, 40, 50, 60, 70, 80,90,100]" :page-size="10" layout="total, sizes, prev, pager, next" :total=total>
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="任务列表(已完成)" name="second">
            <div class="task-table">
              <div class="search-box">
                <div class="search-detail">
                  <el-col :span="10">
                    <el-input v-model="taskConsumer" placeholder="请输入要查找的任务所属者"></el-input>
                  </el-col>
                  <el-col :span="1">
                    &nbsp
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="taskProducer" placeholder="请输入要查找的任务发布者"></el-input>
                  </el-col>
                  <el-col :span="3">
                    <el-button @click="taskSearched">搜索</el-button>
                  </el-col>
                </div>
              </div>
              <el-table :data="tableListed" border stripe style="width: 100%">
                <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
                <el-table-column prop="username" label="成员姓名" align="center" width="90"></el-table-column>
                <el-table-column prop="taskName" label="任务名称" align="center" width="100"></el-table-column>
                <el-table-column prop="taskType" label="类型" align="center" width="60" :formatter="typeFormat"></el-table-column>
                <el-table-column prop="taskDescribe" label="描述" align="center" width="160"></el-table-column>
                <el-table-column label="是否紧急" align="center" width="80">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.isEmergency"></i>
                    <i class="el-icon-close" v-else="scope.row.isEmergency"></i>
                  </template>
                </el-table-column>
                <el-table-column label="是否确认" align="center" width="80">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.isVerify"></i>
                    <i class="el-icon-close" v-else="scope.row.isVerify"></i>
                  </template>
                </el-table-column>
                <el-table-column label="进度" align="center" width="200">
                  <template slot-scope="scope">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column prop="startDate" label="开始日期" sortable align="center" width="140" :formatter="formatTime" ></el-table-column>
                <el-table-column prop="endDate" label="结束日期" sortable align="center" width="140" :formatter="formatTime" ></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable  align="center"  width="140" :formatter="formatTime" ></el-table-column>
                <el-table-column prop="producer" align="center" width="80" label="发布者"></el-table-column>
              </el-table>
            </div>
            <div class="block-page">
              <el-pagination background @size-change="handleSizeChangeed" @current-change="handleCurrentChangeed" :current-page="currentPage"
                             :page-sizes="[5, 10, 20, 30, 40, 50, 60, 70, 80,90,100]" :page-size="10" layout="total, sizes, prev, pager, next" :total=totaled>
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAllMember, addTaskList, getTaskList, deleteTaskById, verifyOperate, getFeedbackTaskSheet,
    getReimList, getPurchaseList, exportPurchase, downloadUrl, exportReim } from '../../api/api'
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
        userGroupForScience: [],
        userGroupForProject: [],
        userGroupForManager: [],
        tableList: [],
        tableListed: [],
        feedbackSheet: [],
        reimSheet: [],
        purchaseSheet: [],
        currentPage: 1,
        total: 10,
        totaled: 10,
        pageNum: 1,
        pageSize: 10,
        taskConsumer: '',
        taskProducer: '',
        activeName: 'first',
        activeTaskList: 'first',
        currentPageSheet: 1,
        sheetTotal: 10,
        pageNumSheet: 1,
        pageSizeSheet: 10,
        reimCurrentPage: 1,
        reimTotal: 10,
        pageNumReim: 1,
        pageSizeReim: 10,
        purchaseCurrentPage: 1,
        purchaseTotal: 10,
        pageNumPurchase: 1,
        pageSizePurchase: 10
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'isAdmin',
        'userId'
      ])
    },
    mounted() {
      this.fillAllMember()
      this.fillFeedbackSheet()
      this.fillReimSheet()
      this.fillPurchaseSheet()
      this.fillTaskTable(this.taskConsumer, this.taskProducer, 0)
      this.fillTaskTable(this.taskConsumer, this.taskProducer, 1)
    },
    methods: {
      onSubmit() {
        const _this = this
        const params = Object.assign({}, this.taskList)
        params.producer = this.name
        addTaskList(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('发布成功')
            _this.fillTaskTable(this.taskConsumer, this.taskProducer, 0)
          } else {
            this.$message.error('发布失败,请重试')
          }
        })
      },
      fillTaskTable(taskConsumer, taskProducer, isComplete) {
        const _this = this
        const params = { pageNum: this.pageNum, pageSize: this.pageSize, taskConsumer: taskConsumer, taskProducer: taskProducer, isComplete: isComplete, tags: 'daily', userId: this.userId }
        if (isComplete === 0) {
          getTaskList(params).then(res => {
            _this.total = res.data.data.total
            _this.tableList = res.data.data.list
          })
        } else {
          getTaskList(params).then(res => {
            _this.totaled = res.data.data.total
            _this.tableListed = res.data.data.list
          })
        }
      },
      handleVerify(index, row) {
        const _this = this
        if (row.username !== this.name) {
          this.$message.warning('只有任务所属者才可确认该条记录')
          return
        }
        const param = { taskId: row.taskId }
        verifyOperate(param).then(res => {
          if (res.data.code === 200) {
            _this.fillTaskTable(this.taskConsumer, this.taskProducer, 0)
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
            _this.fillTaskTable(this.taskConsumer, this.taskProducer, 0)
            _this.fillTaskTable(this.taskConsumer, this.taskProducer, 1)
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
        this.fillTaskTable(this.taskConsumer, this.taskProducer, 0)
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.fillTaskTable(this.taskConsumer, this.taskProducer, 0)
      },
      handleSizeChangeed(val) {
        this.pageSize = val
        this.fillTaskTable(this.taskConsumer, this.taskProducer, 1)
      },
      handleCurrentChangeed(val) {
        this.pageNum = val
        this.fillTaskTable(this.taskConsumer, this.taskProducer, 1)
      },
      fillAllMember() {
        const _this = this
        getAllMember().then(res => {
          _this.userGroupForScience = res.data.data[0]
          _this.userGroupForProject = res.data.data[1]
          _this.userGroupForManager = res.data.data[2]
        })
      },
      indexMethod(index) {
        return index + 1
      },
      formatTime: function(row, column) {
        return util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm')
      },
      typeFormat: function(value) {
        const maps = { read: '阅读', experiment: '实验', write: '写作', reimbursement: '报销', purchase: '采购', activity: '活动', academic: '学术报告' }
        return maps[value.taskType]
      },
      taskSearch() {
        this.fillTaskTable(this.taskConsumer, this.taskProducer, 0)
      },
      taskSearched() {
        this.fillTaskTable(this.taskConsumer, this.taskProducer, 1)
      },
      handleClick(tab, event) {
        console.log()
      },
      handleTableClick(tab, event) {
        console.log()
      },
      fillFeedbackSheet() {
        const _this = this
        const params = { pageNum: this.pageNumSheet, pageSize: this.pageSizeSheet, tags: 'daily' }
        getFeedbackTaskSheet(params).then(res => {
          _this.sheetTotal = res.data.data.total
          _this.feedbackSheet = res.data.data.list
        })
      },
      handleSizeChangeSheet(val) {
        this.pageSizeSheet = val
        this.fillFeedbackSheet()
      },
      handleCurrentChangeSheet(val) {
        this.pageNumSheet = val
        this.fillFeedbackSheet()
      },
      fillReimSheet() {
        const _this = this
        const params = { pageNum: this.pageNumReim, pageSize: this.pageSizeReim }
        getReimList(params).then(res => {
          _this.reimTotal = res.data.data.total
          _this.reimSheet = res.data.data.list
        })
      },
      handleSizeChangeReim(val) {
        this.pageSizeReim = val
        this.fillReimSheet()
      },
      handleCurrentChangeReim(val) {
        this.pageNumReim = val
        this.fillReimSheet()
      },
      fillPurchaseSheet() {
        const _this = this
        const params = { pageNum: this.pageNumPurchase, pageSize: this.pageSizePurchase }
        getPurchaseList(params).then(res => {
          _this.purchaseTotal = res.data.data.total
          _this.purchaseSheet = res.data.data.list
        })
      },
      handleSizeChangePurchase(val) {
        this.pageSizePurchse = val
        this.fillPurchaseSheet()
      },
      handleCurrentChangePurchase(val) {
        this.pageNumPurchase = val
        this.fillPurchaseSheet()
      },
      exportPurchase() {
        exportPurchase().then(res => {
          downloadUrl(res.request.responseURL)
          return
        })
      },
      exportReim() {
        exportReim().then(res => {
          downloadUrl(res.request.responseURL)
          return
        })
      }
    }
  }
</script>

<style scoped>
  .daily {
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
  .block-export {
    text-align: left;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .block-page {
    margin-top: 15px;
    margin-bottom: 15px;
    text-align: right;
  }
  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    cursor: pointer;
    margin: 0 5px -8px 0;
  }
  .search-box{
    margin: 0 auto 20px auto;
    text-align: center;
    width: 80%;
    height: 60px;
    background: #dfdfdf;
  }
  .search-detail{
    line-height: 55px;
    margin-left: 20px;
  }

</style>
