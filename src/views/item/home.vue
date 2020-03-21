<template>
  <div id="home">

    <div class="user-info">
      <el-row>
          <el-col :span="18">
            <div class="group-info">
            <el-card>
              <div class="user-title" slot="header">实验室人员联系方式</div>
                  <div class="group-content">
                    <el-table :data="groupInfo" border style="width: 100%">
                      <el-table-column type="index" align="center" width="50" :index="indexMethod"></el-table-column>
                      <el-table-column prop="username" label="用户名" align="center" width="100"></el-table-column>
                      <el-table-column prop="sex" label="性别" align="center" width="70" :formatter="sexFormat"></el-table-column>
                      <el-table-column prop="mobilePhone" align="center" label="联系电话" width="150"></el-table-column>
                      <el-table-column prop="email" label="邮箱" align="center" width="160"></el-table-column>
                      <el-table-column prop="address" label="地址" align="center" width="160"></el-table-column>
                      <el-table-column prop="createTime" label="创建日期" align="center" width="160" sortable :formatter="formatTime"></el-table-column>
                    </el-table>
                  </div>
                </el-card>
              </div>
          </el-col>
          <el-col :span="1">&nbsp</el-col>
          <el-col :span="5">
            <el-card>
              <div class="user-title" slot="header">个人信息</div>
              <div class="user-content">
                <img class="user-avatar" :src="avatar">
                <div><el-button class="updateImage" type="text" @click="dialogVisible = true">修改图像</el-button></div>
                <div class="user-detail">
                  <div><span>性别: {{sex | format}}</span></div>
                  <div><span>姓名：{{name}}</span></div>
                  <div><span>电话: {{mobile}}</span></div>
                  <div><span>邮箱：{{email}}</span></div>
                  <div><span>地址：{{addr}}</span></div>
                  <div><span v-model="newDesc">描述：{{newDesc}}</span>
                    <el-button size="small" type="text" @click="dialogDescVisible = true">修改</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-dialog title="修改"  :visible.sync="dialogVisible">
            <el-upload ref="upload" action="" :before-upload="beforeUpload" :file-list="fileList" :limit="1" :auto-upload="false" :multiple="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定</el-button>
            </el-upload>
          </el-dialog>
          <el-dialog title="修改描述" :visible.sync=dialogDescVisible>
            <el-row>
              <el-col :span="18"><el-input type="textarea" v-model="newDesc" placeholder="请修改你的描述"></el-input></el-col>
              <el-col :span="6"><el-button type="primary" @click="onSubmit">确认修改</el-button></el-col>
            </el-row>
          </el-dialog>
      </el-row>
    </div>

    <div class="user-info" v-show="isAdmin === 1">

      <el-row>
        <el-col :span="18">
          <el-card>
          <div class="user-title" slot="header">修改操作</div>
          <div class="group-content">

            <el-table :data="groupInfo" border style="width: 100%">
              <el-table-column type="index" align="center" width="50" :index="indexMethod"></el-table-column>
              <el-table-column prop="username" label="用户名" align="center" width="120"></el-table-column>
              <el-table-column prop="userGroup" label="用户组" align="center" width="200" :formatter="userGroupFormat"></el-table-column>
              <el-table-column  prop="userType" label="用户类型" align="center" width="200" :formatter="userTypeFormat"></el-table-column>
              <el-table-column  label="操作" align="center" width="270">
                <template slot-scope="scope">
                  <el-button type="primary" @click="updateUser(scope.$index, scope.row)">修改操作</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          </el-card>
        </el-col>

        <el-col :span="6">&nbsp</el-col>
      </el-row>

    </div>



    <div class="hide">
      <el-dialog title="修改用户所属组" :visible.sync="dialogInputVisible">
        <el-select v-model="userGroup" placeholder="请选择用户组">
          <el-option v-for="item in userGroups" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="userType" placeholder="请选择用户类型">
          <el-option v-for="item in userTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogInputVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUserSubmit">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import { getGroupInfo, updateUserType } from '../../api/api'
  import { uploadImage, updateDesc } from '../../api/upload'
  import util from '../../utils/utils'

  export default {
    name: 'dashboard',
    data() {
      return {
        groupInfo: [],
        fileList: [],
        newDesc: this.desc,
        dialogVisible: false,
        dialogDescVisible: false,
        dialogInputVisible: false,
        formLabelWidth: '120px',
        updateUserId: '',
        userType: '',
        userGroup: '',
        userGroups: [{ value: '1', label: '学术组' }, { value: '2', label: '项目组' }, { value: '3', label: '管理组' }, { value: '4', label: '其他' }],
        userTypes: [{ value: '1', label: '普通用户' }, { value: '2', label: '实验室负责人' }, { value: '3', label: '学术项目指导' }, { value: '4', label: '小组负责人' }]
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1
      },
      updateUser(index, row) {
        this.dialogInputVisible = true
        this.updateUserId = row.userId
        console.log("isadmin:'", this.isAdmin)
      },
      updateUserSubmit() {
        this.dialogInputVisible = false
        const _this = this
        const params = { userId: this.updateUserId, userType: this.userType, userGroup: this.userGroup }
        updateUserType(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功')
            _this.fillGroupInfo()
          } else {
            this.$message.error('修改失败')
          }
        })
      },
      sexFormat(value) {
        return value.sex === 1 ? '男' : '女'
      },
      userGroupFormat(value) {
        const userGroupArray = ['', '普通用户', '实验室负责人', '学术项目指导', '小组负责人']
        return userGroupArray[value.userGroup]
      },
      userTypeFormat(value) {
        return value.userType === 1 ? '学术组' : value.userType === 2 ? '项目组' : value.userType === 3 ? '管理组' : '其他'
      },
      formatTime: function(row, column) {
        return util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm')
      },
      fillGroupInfo() {
        getGroupInfo().then(res => {
          this.groupInfo = res.data.data
        })
      },
      submitUpload() {
        this.$refs.upload.submit()
        this.dialogVisible = false
      },
      beforeUpload: function(file) {
        const fileData = new FormData()
        fileData.append('file', file)
        const _this = this
        uploadImage(fileData).then((res) => {
          if (res.code === 200) {
            _this.$router.go(0)
          } else {
            this.$message.error('更新失败')
          }
        }).catch(err => {
          console.log(err)
        })
      },
      onSubmit() {
        const _this = this
        updateDesc(this.newDesc).then(res => {
          // console.log('res:', res)
          if (res.code === 200) {
            _this.$router.go(0)
          } else {
            this.$message.error('更新失败')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created() {
      this.fillGroupInfo()
      this.newDesc = this.desc
    },
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'avatar',
        'sex',
        'userId',
        'mobile',
        'addr',
        'email',
        'isAdmin',
        'desc'
      ])
    },
    filters: {
      format: function(value) {
        return value === 1 ? '男' : '女'
      }
    }
  }
</script>

<style scoped>
  .user-title {
    font-weight: bold;
  }

  .user-info {
    margin-top: 20px;
    text-align: center;
  }

  .user-group {
    width: 70%;
  }

  .user-personal {
    width: 20%;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    margin-bottom: 6px;
  }

  #home {
    margin: auto;
    width: 70%;
  }
  .split-line {
    margin-top: 20px;
  }

  .user-content {
    text-align: center;
    line-height: 26px;
  }
  .updateImage{
    font-size: 12px;
  }
  .user-detail {
    text-align: left;
  }

</style>
