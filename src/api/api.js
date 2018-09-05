import axios from 'axios'
const exportUrl = process.env.BASE_API
const requestUrl = process.env.BASE_API

// import request from '@/utils/request'
// export function submitContent(params) {
//   return request({
//     url: '/content/getContent',
//     method: 'post',
//     data: params
//   })
// }

// login
export const logintest = params => {
  return axios.post(`http://localhost:8099/api/login`, params)
}

export const exportLogByTime = params => {
  return axios.get(`${exportUrl}/log/exportLogByTime`, { params: params })
}
export const exportCsvLogByTimeCsv = params => {
  return axios.get(`${exportUrl}/log/exportLogForCsv`, { params: params })
}
export const getContentList = params => {
  return axios.get(`${requestUrl}/content/getContentList`, { params: params })
}

export const getGroupInfo = params => { return axios.get(`${requestUrl}/user/getGroupInfo`, { params: params }) }
export const getAllMember = params => { return axios.get(`${requestUrl}/user/getAllMember`, { params: params }) }
export const getTaskList = params => { return axios.get(`${requestUrl}/task/getTaskList`, { params: params }) }
export const getTaskRecord = params => { return axios.get(`${requestUrl}/task/getTaskRecord`, { params: params }) }
export const verifyOperate = params => { return axios.get(`${requestUrl}/task/verifyOperate`, { params: params }) }
export const renewProgress = params => { return axios.get(`${requestUrl}/task/renewProgress`, { params: params }) }
export const deleteTaskById = params => { return axios.delete(`${requestUrl}/task/deleteTaskById`, { params: params }) }
export const addTaskList = params => { return axios.post(`${requestUrl}/task/addTaskList`, params) }

export const hiddeContent = params => { return axios.get(`${requestUrl}/content/hiddeContent`, { params: params }) }
export const uploadHandle = params => { return axios.post(`${requestUrl}/upload/uploadHandle`, params) }
export const submitContent = params => { return axios.post(`${requestUrl}/content/addContent`, params) }

