import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 菜谱 VO
export namespace MealsRecipeApi {
  /** 菜谱信息*/
  export interface Recipe {
    id: number; // 编号
    name?: string; // 名称
    recipeDesc?: string; // 简介
    recipeStep?: string; // 教程
    recipeType?: number; // 菜谱类型
    recipeCategory?: number[]; // 菜谱分类
    recipeLevel?: number; // 烹饪难度
    sort?: number; // 排序
    memo?: string; // 备注
    status?: number; // 状态
    picUrl?: string; // 菜谱封面图
    sliderPicUrls?: string[]; // 菜谱轮播图
  }

  /** 菜谱食材信息 */
  export interface RecipeFood {
    id: number;
    recipeId: number;
    foodId: number;
    amount: number;
    foodUnit: number; // 食材单位
    memo: string;
  }
}

// 菜谱 API
/** 查询菜谱分页*/
export function getRecipePage(params: PageParam) {
  return requestClient.get<PageResult<MealsRecipeApi.Recipe>>(
    `/meals/recipe/page`,
    { params },
  );
}

/** 查询菜谱详情 */
export function getRecipe(id: number) {
  return requestClient.get<MealsRecipeApi.Recipe>(`/meals/recipe/get?id=${id}`);
}

/** 新增菜谱 */
export function createRecipe(data: MealsRecipeApi.Recipe) {
  return requestClient.post(`/meals/recipe/create`, data);
}

/** 修改菜谱 */
export function updateRecipe(data: MealsRecipeApi.Recipe) {
  return requestClient.put(`/meals/recipe/update`, data);
}

/** 删除菜谱 */
export function deleteRecipe(id: number) {
  return requestClient.delete(`/meals/recipe/delete?id=${id}`);
}

/** 导出菜谱 Excel */
export function exportRecipe(params: any) {
  return requestClient.download(`/meals/recipe/export-excel`, params);
}

/** ==================== 子表（菜谱食材） ====================

/** 获得菜谱食材分页 */
export function getRecipeFoodPage(params: PageParam) {
  return requestClient.get<PageResult<MealsRecipeApi.RecipeFood>>(
    `/meals/recipe/recipe-food/page`,
    { params },
  );
}
/** 新增菜谱食材 */
export function createRecipeFood(data: MealsRecipeApi.RecipeFood) {
  return requestClient.post(`/meals/recipe/recipe-food/create`, data);
}

/** 修改菜谱食材 */
export function updateRecipeFood(data: MealsRecipeApi.RecipeFood) {
  return requestClient.put(`/meals/recipe/recipe-food/update`, data);
}

/** 删除菜谱食材 */
export function deleteRecipeFood(id: number) {
  return requestClient.delete(`/meals/recipe/recipe-food/delete?id=${id}`);
}

/** 获得菜谱食材 */
export function getRecipeFood(id: number) {
  return requestClient.get<MealsRecipeApi.RecipeFood>(
    `/meals/recipe/recipe-food/get?id=${id}`,
  );
}
