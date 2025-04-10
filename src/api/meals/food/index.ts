import request from '@/config/axios'

// 食材 VO
export interface FoodVO {
  id: number // 编号
  name: string // 名称
  foodType: number // 分类
  foodUnit: number // 单位
  memo: string // 备注
}

// 食材 API
export const FoodApi = {
  // 获取食材精简信息列表
  getSimpleFoodList: async () => {
    return await request.get({ url: `/meals/food/list-all-simple` })
  },

  // 查询食材分页
  getFoodPage: async (params: any) => {
    return await request.get({ url: `/meals/food/page`, params })
  },

  // 查询食材详情
  getFood: async (id: number) => {
    return await request.get({ url: `/meals/food/get?id=` + id })
  },

  // 新增食材
  createFood: async (data: FoodVO) => {
    return await request.post({ url: `/meals/food/create`, data })
  },

  // 修改食材
  updateFood: async (data: FoodVO) => {
    return await request.put({ url: `/meals/food/update`, data })
  },

  // 删除食材
  deleteFood: async (id: number) => {
    return await request.delete({ url: `/meals/food/delete?id=` + id })
  },

  // 导出食材 Excel
  exportFood: async (params) => {
    return await request.download({ url: `/meals/food/export-excel`, params })
  }
}
