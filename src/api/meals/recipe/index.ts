import request from '@/config/axios'

// 菜谱 VO
export interface RecipeVO {
  id: number // 编号
  name: string // 名称
  recipeDesc: string // 简介
  recipeStep: string // 教程
  recipeType: number // 菜谱类型
  recipeCategory: number[] // 菜谱分类
  recipeLevel: number // 烹饪难度
  sort: number // 排序
  memo: string // 备注
  status: number // 状态
  picUrl: string // 菜谱封面图
  sliderPicUrls: string[] // 菜谱轮播图
}

// 菜谱 API
export const RecipeApi = {
  // 查询菜谱分页
  getRecipePage: async (params: any) => {
    return await request.get({ url: `/meals/recipe/page`, params })
  },

  // 查询菜谱详情
  getRecipe: async (id: number) => {
    return await request.get({ url: `/meals/recipe/get?id=` + id })
  },

  // 新增菜谱
  createRecipe: async (data: RecipeVO) => {
    return await request.post({ url: `/meals/recipe/create`, data })
  },

  // 修改菜谱
  updateRecipe: async (data: RecipeVO) => {
    return await request.put({ url: `/meals/recipe/update`, data })
  },

  // 删除菜谱
  deleteRecipe: async (id: number) => {
    return await request.delete({ url: `/meals/recipe/delete?id=` + id })
  },

  // 导出菜谱 Excel
  exportRecipe: async (params) => {
    return await request.download({ url: `/meals/recipe/export-excel`, params })
  },

  // ==================== 子表（菜谱食材） ====================

  // 获得菜谱食材分页
  getRecipeFoodPage: async (params) => {
    return await request.get({ url: `/meals/recipe/recipe-food/page`, params })
  },
  // 新增菜谱食材
  createRecipeFood: async (data) => {
    return await request.post({ url: `/meals/recipe/recipe-food/create`, data })
  },

  // 修改菜谱食材
  updateRecipeFood: async (data) => {
    return await request.put({ url: `/meals/recipe/recipe-food/update`, data })
  },

  // 删除菜谱食材
  deleteRecipeFood: async (id: number) => {
    return await request.delete({ url: `/meals/recipe/recipe-food/delete?id=` + id })
  },

  // 获得菜谱食材
  getRecipeFood: async (id: number) => {
    return await request.get({ url: `/meals/recipe/recipe-food/get?id=` + id })
  }
}
