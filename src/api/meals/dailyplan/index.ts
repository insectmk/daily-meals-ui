import request from '@/config/axios'

// 菜谱计划 VO
export interface DailyPlanVO {
  id: number // 编号
  recipeId: number // 菜谱ID
  planDate: Date // 计划日
  mealType: number // 餐次类型
  memo: string // 备注
}

// 菜谱计划 API
export const DailyPlanApi = {
  // 查询菜谱计划分页
  getDailyPlanPage: async (params: any) => {
    return await request.get({ url: `/meals/daily-plan/page`, params })
  },

  // 查询菜谱计划详情
  getDailyPlan: async (id: number) => {
    return await request.get({ url: `/meals/daily-plan/get?id=` + id })
  },

  // 新增菜谱计划
  createDailyPlan: async (data: DailyPlanVO) => {
    return await request.post({ url: `/meals/daily-plan/create`, data })
  },

  // 修改菜谱计划
  updateDailyPlan: async (data: DailyPlanVO) => {
    return await request.put({ url: `/meals/daily-plan/update`, data })
  },

  // 删除菜谱计划
  deleteDailyPlan: async (id: number) => {
    return await request.delete({ url: `/meals/daily-plan/delete?id=` + id })
  },

  // 导出菜谱计划 Excel
  exportDailyPlan: async (params) => {
    return await request.download({ url: `/meals/daily-plan/export-excel`, params })
  }
}