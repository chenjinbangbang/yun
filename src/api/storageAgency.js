import request from '@/utils/request'; //axios默认配置

//获取存储代理列表，查询
export function getStorageAgencyList(data) {
  //let region_center_id = data.region_center_id;
  
  return request({
    url: '/admin/client/sgwstatic/list',
    method: 'post',
    data
  })
}

//存储代理服务状态管理
export function sgwoperate(data){
  return request({
    url: '/admin/sgw/sgwoperate',
    method: 'post',
    data
  });
}