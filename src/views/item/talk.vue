<template>
  <div class="user-talk">

    <div class="top">
      <el-card class="box-card" v-for="(commentList,key) in commentLists " :key="key">
        <div slot="header">
          <span><span style="font-weight: bold; margin: 4px;">任务名称 : {{commentList.taskName}}</span></span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="removeTalk(commentList.taskName)">移除</el-button>
        </div>
       <el-col :span="22">
         <el-input type="textarea" autosize placeholder="请输入内容" v-model:inputContent="commentList.input"></el-input>
       </el-col>
        <el-col :span="2">
          <el-button size="small" type="primary" @click="submitTalk(commentList.taskName,commentList.input)">提交</el-button>
        </el-col>
        <div class="clear-float"></div>
        <div class="comment-zone">
          <div class="comment-list">
            <ul class="ul-content">
              <li v-for="(item, key) in commentList.list" :key="key">
                <div class="content-items">
                  <span><img class="content-img" :src="item.avatar"></span>
                  <span class="content-time">发表于 {{item.createTime | formatTime}}</span>
                </div>
                <div class="content-text" v-if="item.parentId !== null"><span class="username-part">{{item.username}}</span>回复<span class="username-part">{{item.parentName}}</span>: {{item.content}}
                  <div class="content-reply"><el-button size="mini" @click="replyShow">回复</el-button></div></div>
                <div class="content-text" v-else><span class="username-part">{{item.username}}</span>: {{item.content}}
                  <div class="content-reply"><el-button size="mini" @click="replyShow">回复</el-button></div>
                </div>
                <div class="clear-float"></div>
                <div class="reply-zone" v-show="isShowReply">
                  <el-col :span="22">
                    <el-input type="textarea" autosize placeholder="请输入回复内容" v-model:replyContent="item.reply"></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button size="small" type="info" @click="submitReply(commentList.taskName,item.userId,item.username,item.reply)">提交</el-button>
                  </el-col>
                </div>
                <div class="clear-float"></div>
              </li>
            </ul>
          </div>
        </div>

      </el-card>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getCommentList, addComment, deleteTalk } from '../../api/api'
  import util from '../../utils/utils'

  export default {
    name: 'talk',
    data() {
      return {
        progress: 0,
        input_text: '',
        isShowReply: false,
        commentLists: []
      }
    },
    computed: {
      ...mapGetters([
        'isAdmin',
        'userId'
      ])
    },
    methods: {
      fillCommentList() {
        const _this = this
        const param = { userId: this.userId }
        getCommentList(param).then(res => {
          _this.commentLists = res.data.data
          console.log('commentLists: ', _this.commentLists)
        })
      },
      submitTalk(taskName, content) {
        if (content == null) {
          this.$message.warning('输入内容不可为空')
          return
        }
        const params = { taskName: taskName, userId: this.userId, content: content }
        console.log('submit_task: ', params)
        addComment(params).then(res => {
          console.log('submit_res: ', res)
          this.fillCommentList()
        })
      },
      submitReply(taskName, parentId, parentName, content) {
        if (content == null) {
          this.$message.warning('输入内容不可为空')
          return
        }
        const params = { taskName: taskName, userId: this.userId, content: content, parentId: parentId, parentName: parentName }
        console.log('reply_params:', params)
        addComment(params).then(res => {
          console.log('submit_res: ', res)
          this.isShowReply = false
          this.fillCommentList()
        })
      },
      replyShow(index) {
        this.isShowReply = !this.isShowReply
      },
      removeTalk(taskName) {
        console.log('taskName: ', taskName)
        const param = { taskName: taskName, userId: this.userId }
        deleteTalk(param).then(res => {
          console.log('delete: ', res)
          if (res.data.code === 200) {
            this.$message.success('移除成功')
            this.fillCommentList()
          } else {
            this.$message.warning(res.data.message)
          }
        })
      }
    },
    created() {
      this.fillCommentList()
    },
    filters: {
      formatTime: function(value) {
        return util.formatDate.format(new Date(value), 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style scoped>
  .user-talk {
    margin: auto;
    width: 50%;
  }
  .top {
    margin-top: 20px;
  }
  .box-card {
    margin-bottom:20px;
  }
  .content-items {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .content-img {
    width: 35px;
    height: 35px;
    border-radius: 30px;
  }
  .ul-content {
    margin: 0;
    padding:14px 0 0 0;
  }
  li {
    list-style: none;
    border-bottom:thin solid #b7b7b7;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .content-time {
    margin: -15px 0 0 15px;
    color: #7d8189;
  }
  .content-text {
    margin:-10px 0 0 45px;
  }

  .content-reply {
    float: right;
    margin-top:-5px;
    margin-right: 10px;
  }
  .clear-float{
    clear: both;
  }
  .username-part {
    color: #4694ff;
    margin: 4px;
  }
  .reply-zone {
    margin: 10px 0 0 50px;
  }

</style>
