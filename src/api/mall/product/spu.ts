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

export interface Spu {
  id?: number
  name?: string // 商品名称
  categoryId?: number | null // 商品分类
  keyword?: string // 关键字
  unit?: number | null // 单位
  picUrl?: string // 商品封面图
  sliderPicUrls?: string[] // 商品轮播图
  introduction?: string // 商品简介
  deliveryTemplateId?: number | null // 运费模版
  brandId?: number | null // 商品品牌编号
  specType?: boolean // 商品规格
  subCommissionType?: boolean // 分销类型
  skus?: Sku[] // sku数组
  description?: string // 商品详情
  sort?: number // 商品排序
  giveIntegral?: number // 赠送积分
  virtualSalesCount?: number // 虚拟销量
  recommendHot?: boolean // 是否热卖
  recommendBenefit?: boolean // 是否优惠
  recommendBest?: boolean // 是否精品
  recommendNew?: boolean // 是否新品
  recommendGood?: boolean // 是否优品
  price?: number // 商品价格
  salesCount?: number // 商品销量
  marketPrice?: number // 市场价
  costPrice?: number // 成本价
  stock?: number // 商品库存
  createTime?: Date // 商品创建时间
  status?: number // 商品状态
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

// 创建商品 Spu
export const createSpu = (data: Spu) => {
  return request.post({ url: '/product/spu/create', data })
}

// 更新商品 Spu
export const updateSpu = (data: Spu) => {
  return request.put({ url: '/product/spu/update', data })
}

// 更新商品 Spu status
export const updateStatus = (data: { id: number; status: number }) => {
  return request.put({ url: '/product/spu/update-status', data })
}

// 获得商品 Spu
export const getSpu = (id: number) => {
  return request.get({ url: `/product/spu/get-detail?id=${id}` })
}

// 获得商品 Spu 详情列表
export const getSpuDetailList = (ids: number[]) => {
  return request.get({ url: `/product/spu/list?spuIds=${ids}` })
}

// 删除商品 Spu
export const deleteSpu = (id: number) => {
  return request.delete({ url: `/product/spu/delete?id=${id}` })
}

// 导出商品 Spu Excel
export const exportSpu = async (params) => {
  return await request.download({ url: '/product/spu/export', params })
}

// 获得商品 SPU 精简列表
export const getSpuSimpleList = async () => {
  return request.get({ url: '/product/spu/get-simple-list' })
}
