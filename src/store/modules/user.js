import { login, logout, getInfo, register } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    email: '',
    mobile: '',
    sex: '',
    address: '',
    updateTime: '',
    isAdmin: '',
    desc: ''

  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_SEX: (state, sex) => {
      state.sex = sex
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_ADDR: (state, addr) => {
      state.addr = addr
    },
    SET_ISADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin
    },
    SET_DESC: (state, desc) => {
      state.desc = desc
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 注册
    Register({ commit }, registerForm) {
      return new Promise((resolve, reject) => {
        register(registerForm).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', 'admin') // temp
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.avatar)
          commit('SET_SEX', data.sex)
          commit('SET_MOBILE', data.mobilePhone)
          commit('SET_USERID', data.userId)
          commit('SET_EMAIL', data.email)
          commit('SET_ADDR', data.address)
          commit('SET_ISADMIN', data.isAdmin)
          commit('SET_DESC', data.characterDesc)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
