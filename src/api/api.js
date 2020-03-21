import axios from 'axios'

const requestUrl = process.env.BASE_API

export const getContentList = params => {
  return axios.get(`${requestUrl}/content/getContentList`, { params: params })
}

export const isValidateCode = params => { return axios.get(`${requestUrl}/user/isValidateCode`, { params: params }) }
export const uploadImage = params => { return axios.post(`${requestUrl}/upload/uploadImage`, params) }
export const getGroupInfo = params => { return axios.get(`${requestUrl}/user/getGroupInfo`, { params: params }) }
export const updateUserType = params => { return axios.get(`${requestUrl}/user/updateUserType`, { params: params }) }
export const getAllMember = params => { return axios.get(`${requestUrl}/user/getAllMember`, { params: params }) }
export const getNewUserNum = params => { return axios.get(`${requestUrl}/user/getNewUserNum`, { params: params }) }

export const getUnreadMsg = params => { return axios.get(`${requestUrl}/task/getUnreadMsg`, { params: params }) }
export const getTaskList = params => { return axios.get(`${requestUrl}/task/getTaskList`, { params: params }) }
export const getTaskRecord = params => { return axios.get(`${requestUrl}/task/getTaskRecord`, { params: params }) }
export const verifyOperate = params => { return axios.get(`${requestUrl}/task/verifyOperate`, { params: params }) }
export const renewProgress = params => { return axios.get(`${requestUrl}/task/renewProgress`, { params: params }) }
export const deleteTaskById = params => { return axios.delete(`${requestUrl}/task/deleteTaskById`, { params: params }) }
export const addTaskList = params => { return axios.post(`${requestUrl}/task/addTaskList`, params) }
export const getUnreadMsgList = params => { return axios.get(`${requestUrl}/task/getUnreadMsgList`, { params: params }) }
export const updateReadState = params => { return axios.get(`${requestUrl}/task/updateReadState`, { params: params }) }

export const hiddeContent = params => { return axios.get(`${requestUrl}/content/hiddeContent`, { params: params }) }
export const uploadHandle = params => { return axios.post(`${requestUrl}/upload/uploadHandle`, params) }
export const submitContent = params => { return axios.post(`${requestUrl}/content/addContent`, params) }

export const insertFeedbackMsg = params => { return axios.get(`${requestUrl}/feed/insertFeedbackMsg`, { params: params }) }
export const addPurchaseSheet = params => { return axios.post(`${requestUrl}/feed/addPurchaseSheet`, params) }
export const addReimSheet = params => { return axios.post(`${requestUrl}/feed/addReimSheet`, params) }
export const uploadFileRecord = params => { return axios.get(`${requestUrl}/feed/uploadFileRecord`, { params: params }) }
export const getFeedbackTaskSheet = params => { return axios.get(`${requestUrl}/feed/getFeedbackTaskSheet`, { params: params }) }
export const getReimList = params => { return axios.get(`${requestUrl}/feed/getReimList`, { params: params }) }
export const getPurchaseList = params => { return axios.get(`${requestUrl}/feed/getPurchaseList`, { params: params }) }

export const getCommentList = params => { return axios.get(`${requestUrl}/comment/getCommentList`, { params: params }) }
export const deleteTalk = params => { return axios.delete(`${requestUrl}/comment/deleteTalk`, { params: params }) }
export const addComment = params => { return axios.post(`${requestUrl}/comment/addComment`, params) }

export const exportPurchase = params => { return axios.get(`${requestUrl}/export/exportPurchase`, { params: params }) }
export const exportReim = params => { return axios.get(`${requestUrl}/export/exportReim`, { params: params }) }
export const downloadUrl = url => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  iframe.onload = () => {
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
}
