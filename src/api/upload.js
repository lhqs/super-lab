import request from '@/utils/request'

export function uploadImage(file) {
  return request({
    url: '/upload/uploadImage',
    method: 'post',
    data: file
  })
}
export function uploadFile(file) {
  return request({
    url: '/upload/uploadFile',
    method: 'post',
    data: file
  })
}
export function updateDesc(newDesc) {
  return request({
    url: '/user/updateDesc',
    method: 'get',
    params: { newDesc }
  })
}
