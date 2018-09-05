const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  sex: state => state.user.sex,
  userId: state => state.user.userId,
  mobile: state => state.user.mobile,
  email: state => state.user.email,
  addr: state => state.user.addr
}
export default getters
