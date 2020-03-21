<template>
  <div class="register-container">
    <el-form class="register-form" :model="RegisterForm" :rules="registerRules" ref="RegisterForm">
      <h3 class="title">注册账号</h3>
      <el-form-item>
        <el-input name="username" type="text" v-model="RegisterForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-input name="email" type="text" v-model="RegisterForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item>
        <el-input name="mobilePhone" type="text" v-model="RegisterForm.mobilePhone" placeholder="请输入手机号码" />
      </el-form-item>

      <el-form-item prop="registerCode">
        <el-input name="registerCode" type="text" v-model="RegisterForm.registerCode" placeholder="请输入邀请码" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password" type="text" v-model="RegisterForm.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="RegisterForm.sex" placeholder="请选择性别" style="width:100%;">
          <el-option label="女" value="0"></el-option>
          <el-option label="男" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click="handleRegister">注册</el-button>
      </el-form-item>
      <ul>
        <li style="text-align: center;line-height: 20px; margin-bottom:0;font-size: 12px;color: white;">
          <span>已拥有账号，则可在此</span><a href="javascript:;" style="margin: 0 5px; color: red" @click="toLogin">登陆</a>
        </li>
      </ul>
    </el-form>
  </div>
</template>

<script>
import { isValidateCode } from '../../api/api'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      const requestParam = { registerCode: value }
      isValidateCode(requestParam).then(res => {
        if (res.data.code === 200) {
          callback()
        } else {
          callback(new Error('无效邀请码'))
        }
      })
    }
    return {
      RegisterForm: {
        username: '',
        password: '',
        email: '',
        mobilePhone: '',
        sex: ''
      },
      registerRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        registerCode: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false
    }
  },
  methods: {
    toLogin() {
      this.$router.push('/login')
    },
    handleRegister() {
      this.$refs.RegisterForm.validate(valid => {
        if (valid) {
          console.log('form_data', this.RegisterForm)
          this.loading = true
          this.$store.dispatch('Register', this.RegisterForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          // this.$message.error('error')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .register-container {
    position: fixed;
    height: 100%;
    width: 100%;
    /*background-image: url(http://qiniu.lhqs1314.cn/file/lab/sea_tree.jpg);*/
    background-image: url(http://qiniu.lhqs1314.cn/lab.jpg);
    background-size: 100% 100%;
  }
  input > .el-input__inner {
    background-color: transparent !important
  }
  .register-form {
    background-color: rgba(253, 251, 255, 0.1);
    left: 0;
    right: 0;
    width: 440px;
    padding: 10px 10px 4px 10px;
    float: right;
    margin: 100px 50px;
  }
  ul li{
    list-style-type:none;
  }
  .title {
    font-size: 26px;
    color: white;
    margin: 10px auto 20px auto;
    text-align: center;
    font-weight: bold;
  }

</style>



