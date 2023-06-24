import request from '@/config/axios'

// 创建商品 SPU
export function createSpu(data) {
  return request.post({
    url: '/product/spu/create',
    data: data
  })
}

// 更新商品 SPU
export function updateSpu(data) {
  return request.put({
    url: '/product/spu/update',
    data: data
  })
}

// 删除商品 SPU
export function deleteSpu(id) {
  return request.delete({
    url: `/product/spu/delete?id=${id}`
  })
}

// TODO @puhui999: SpuRespVO 合并到 SPU 里？前端少点 VO 类哈；
export interface SpuRespVO extends Spu {
  price: number
  salesCount: number
  marketPrice: number
  costPrice: number
  stock: number
  createTime: Date
  status: number
}

// 获得 Spu 列表
export const getSpuPage = (params: PageParam) => {
  return request.get({ url: '/product/spu/page', params })
}

// 获得商品 SPU 分页
export function getSpuPage(query) {
  return request.get({
    url: '/product/spu/page',
    params: query
  })
}

// 获得商品 SPU 精简列表
export function getSpuSimpleList() {
  return request.get({
    url: '/product/spu/get-simple-list'
  })
}

// 获得商品 SPU 精简列表
export const getSpuSimpleList = async () => {
  return request.get({ url: '/product/spu/get-simple-list' })
}
