import request from '@/config/axios'

// 菜谱分类 VO
export interface RecipeCategoryVO {
  id: number // 分类编号
  parentId: number // 父分类编号
  name: string // 分类名称
  picUrl: string // 移动端分类图
  sort: number // 分类排序
  status: number // 开启状态
  memo: string // 备注
}

// 菜谱分类 API
export const RecipeCategoryApi = {
  // 查询菜谱分类列表
  getRecipeCategoryList: async (params) => {
    return await request.get({ url: `/meals/recipe-category/list`, params })
  },

  // 查询菜谱分类详情
  getRecipeCategory: async (id: number) => {
    return await request.get({ url: `/meals/recipe-category/get?id=` + id })
  },

  // 新增菜谱分类
  createRecipeCategory: async (data: RecipeCategoryVO) => {
    return await request.post({ url: `/meals/recipe-category/create`, data })
  },

  // 修改菜谱分类
  updateRecipeCategory: async (data: RecipeCategoryVO) => {
    return await request.put({ url: `/meals/recipe-category/update`, data })
  },

  // 删除菜谱分类
  deleteRecipeCategory: async (id: number) => {
    return await request.delete({ url: `/meals/recipe-category/delete?id=` + id })
  },

  // 导出菜谱分类 Excel
  exportRecipeCategory: async (params) => {
    return await request.download({ url: `/meals/recipe-category/export-excel`, params })
  }
}