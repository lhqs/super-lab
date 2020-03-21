<template class="setting">
  <div class="top">

    <div class="title-zone">
      <el-card>
        <div>{{title}}</div>
        <div class="input-content">
          <el-input type="textarea" v-model="content" :placeholder="placeholder" rows="4"></el-input>
        </div>

        <div class="upload-submit">
          <div class="file-show" v-show="isShowList">
            <div class="image-showlist" v-for="img in imageUrl">
              <img :src="img" style="width: 140px; height: 80px;margin:0 10px 5px 0;cursor: pointer; ">
            </div>
            <div class="file-showlist" v-for="file in fileUrl">
              <div class="show-file"><span>文件</span></div>
              <div class="file-name">{{ file | getFileName }}</div>
            </div>
          </div>

          <div class="submit-zone">
            <el-button type="danger" size="small" @click="onReset">清除</el-button>
            <el-button type="primary" size="small" @click="onSubmit">发布</el-button>
          </div>
          <el-upload class="upload-file" action="attr" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
            :on-change="onChange" multiple :show-file-list=false :limit="20" :http-request="customUpload" :on-exceed="handleExceed" :file-list="fileList">
            <el-button size="small" type="primary">上传附件</el-button>
          </el-upload>
        </div>
      </el-card>
    </div>


    <div class="list">
      <div class="list-show" v-for="content,index in contents">
        <el-card>
          <div class="publish-head" slot="header">
            <div class="content-head">
              <span><img class="content-img" :src="content.avatar"></span>
              <span class="content-name">{{content.username}}</span> <span>发表于</span>
              <span class="content-time">{{content.createTime | formatTime }}</span>
            </div>
            <div class="delete-icon">
              <i @click="onIconDelete(content.contentId, content.userId)" class="el-icon-delete"></i>
            </div>
          </div>

          <div class="content-list">
            <div class="content-shows"><p v-html="content.content"></p></div>
            <div class="image-showlist" v-for="image in content.imageUrl" v-if="content.imageUrl[0] != ''">
              <a :href="image" target="_blank"><img :src="image"
                                                    style="width: 184px; height: 140px;margin: 10px 5px 0 5px;cursor: pointer; "></a>
            </div>
            <div class="file-showlist" v-for="file in content.fileUrl" v-if="content.fileUrl[0] != ''">
              <div class="show-file"><span>文件</span></div>
              <a :href="file"><div class="file-name">{{ file | getFileName }}</div></a>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <div class="loading-button">
      <el-card>
        <el-button type="primary" round size="normal" @click="loadingMore">加载更多</el-button>
      </el-card>
    </div>
  </div>

</template>

<script>
  import { uploadHandle, submitContent, getContentList, hiddeContent } from '../../api/api'
  import { mapGetters } from 'vuex'
  import { isPicture } from '../../utils/utils'
  import util from '../../utils/utils'

  export default {
    name: 'show',
    data() {
      return {
        title: '你有什么想要分享的',
        content: '',
        placeholder: '请在这里写下你的文字',
        isShowList: true,
        fileList: [],
        uploadedFile: '',
        imageUrl: [],
        fileUrl: [],
        contents: []
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    filters: {
      formatTime: function(value) {
        return util.formatDate.format(new Date(value), 'yyyy-MM-dd hh:mm')
      },
      stringToArray: function(value) {
        return value.split(',')
      },
      getFileName: function(value) {
        const files = value.split('/')
        return files[files.length - 1]
      }
    },
    created() {
      this.getShowList()
    },
    methods: {
      onReset() {
        this.content = ''
        this.fileUrl = []
        this.imageUrl = []
      },
      loadingMore() {
        const _this = this
        const len = this.contents.length
        const reqData = { contentId: this.contents[len - 1].contentId }
        getContentList(reqData).then(res => {
          if (res.data.data.length === 0) {
            this.$message('已加载完毕，没有内容了')
          } else {
            _this.contents = _this.contents.concat(res.data.data)
          }
        })
      },
      onSubmit() {
        const _this = this
        const reqData = { userId: this.userId, content: this.content, imageUrl: this.imageUrl, fileUrl: this.fileUrl }
        submitContent(reqData).then(res => {
          if (res.data.code === 200) {
            this.$message.success('发布成功')
            _this.content = ''
            _this.fileUrl = []
            _this.imageUrl = []
            _this.getShowList()
          } else {
            this.$message.error('发布失败，请刷新后重试')
          }
        })
      },
      getShowList() {
        const _this = this
        const reqData = { contentId: '' }
        getContentList(reqData).then(res => {
          console.log('getContentList', res)
          _this.contents = res.data.data
          console.log('getList', _this.contents)
        })
      },
      onIconDelete(param, userId) {
        const _this = this
        const reqData = { contentId: param }
        if (userId !== this.userId) {
          this.$message.warning('只能删除自己发布的内容')
        } else {
          hiddeContent(reqData).then(res => {
            if (res.data.code === 200) {
              for (let i = 0; i < _this.contents.length; i++) {
                if (_this.contents[i].contentId === param) {
                  const head = _this.contents.slice(0, i)
                  const tail = _this.contents.slice(i + 1, _this.contents.length)
                  _this.contents = head.concat(tail)
                }
              }
              this.$message.success('成功删除')
            } else {
              this.$message.error('删除失败')
            }
          })
        }
      },
      handleRemove(file, fileList) {
        console.log('handleRemove', file, fileList)
      },
      handlePreview(file) {
        console.log('handlePreview', file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      onChange(file, fileList) {
        console.log('handleChange', file, fileList)
      },
      customUpload(param) {
        this.isShowList = true
        const _this = this
        const fileData = new FormData()
        fileData.append('file', param.file)
        uploadHandle(fileData).then((res) => {
          const fileName = res.data.data
          if (isPicture(fileName)) {
            _this.imageUrl.push(fileName)
          } else {
            _this.fileUrl.push(fileName)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .top {
    margin: auto;
    width: 50%;
  }

  .title-zone {
    margin-top: 10px;
  }

  .input-content {
    text-align: center;
    margin: 10px 0px 10px 0px;
  }

  .submit-zone {
    float: right;
  }

  .list {
    clear: both;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .list-show {
    margin-top: 20px;
  }

  .upload-submit {
    display: inline;
  }

  .upload-file {
    width: 90%;
  }

  .content-head {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .content-img {
    width: 35px;
    height: 35px;
    border-radius: 30px;
  }

  .content-name {
    margin: 0px 10px 0px 20px;
  }

  .content-time {
    margin-left: 10px;
  }

  .image-showlist {
    display: inline-flex;
    flex-wrap: wrap;
  }

  .publish-head {
    display: flex;
    justify-content: space-between;
  }

  .file-showlist {
    margin-top: 10px;
    display: flex;
    width: 300px;
    height: 30px;
    margin-bottom: 10px;
    box-shadow: 4px 4px 6px 1px rgba(226, 227, 231, 0.34);
    color: #4D4D4D;
    font-size: 12px;
    align-items: center;
    background: #FFF;
  }

  .show-file {
    display: flex;
    width: 50px;
    height: 30px;
    color: #FFF;
    font-size: 9px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    background-color: #2DB0F9;
    background-size: cover;
    background-position: center;
  }

  .file-name {
    flex-grow: 1;
    margin-left: 12px;
    margin-right: 4px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .content-shows {
    line-height: 24px;
    font-size: 14px;
    height: 100%;
    white-space: pre-wrap;
  }

  .el-icon-delete:hover {
    cursor: pointer;
    position: relative;
  }

  .delete-icon {
    line-height: 38px;
  }
  .loading-button {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
