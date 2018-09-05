<template>
  <div id="home">

    <div class="user-info">
      <el-card>
        <div class="user-title" slot="header">个人信息</div>
        <div class="user-content">
          <img class="user-avatar" :src="avatar">
          <div><span>性别: {{sex | format}}</span></div>
          <div><span>姓名：{{name}}</span></div>
          <div><span>电话: {{mobile}}</span></div>
          <div><span>邮箱：{{email}}</span></div>
          <div><span>地址：{{addr}}</span></div>
        </div>
      </el-card>

      <div class="group-info">
        <el-card>
          <div class="user-title" slot="header">团队信息</div>

              <div class="group-content">
                <el-table
                  :data="groupInfo"
                  border
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    align="center"
                    width="50"
                    :index="indexMethod">
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    label="用户名"
                    align="center"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="sex"
                    label="性别"
                    align="center"
                    width="56"
                    :formatter="sexFormat">
                  </el-table-column>
                  <el-table-column
                    prop="mobilePhone"
                    align="center"
                    label="联系电话"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="email"
                    label="邮箱"
                    align="center"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="地址"
                    align="center"
                    width="170">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="创建日期"
                    align="center"
                    width="160"
                    sortable
                    :formatter="formatTime">
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>
      </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import { getGroupInfo } from '../../api/api'
  import util from '../../utils/utils'

  export default {
    name: 'dashboard',
    data() {
      return {
        groupInfo: []
      }
    },
    methods: {
      indexMethod(index) {
        return index + 1
      },
      sexFormat(value) {
        return value.sex === 1 ? '男' : '女'
      },
      formatTime: function(row, column) {
        return util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm')
      },
      fillGroupInfo() {
        getGroupInfo().then(res => {
          console.log('home', res)
          this.groupInfo = res.data.data
        })
      }
    },
    created() {
      this.fillGroupInfo()
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
        'email'
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
    margin-top: 40px;
    text-align: center;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    margin-bottom: 16px;
  }

  #home {
    margin: auto;
    width: 50%;
  }

  .user-content {
    text-align: center;
    line-height: 26px;
  }
  .group-info {
    margin-top: 40px;
  }
</style>
