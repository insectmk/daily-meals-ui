import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 菜谱菜单 VO
export namespace MealsRecipeMenuApi {
  /** 菜谱菜单 */
  export interface RecipeMenu {
    id: number; // 编号
    userId: number; // 用户编号
    title: string; // 标题
    subtitle: string; // 副标题
    menuDesc: string; // 菜单描述
    picUrl: string; // 菜单封面图
    memo: string; // 备注
  }

  /** 菜单菜谱 */
  export interface MenuRecipe {
    id: number; // 编号
    recipeMenuId: number; // 菜谱菜单编号
    recipeId: number; // 菜谱编号
    memo: string; // 备注
  }
}

// 菜谱菜单 API
/** 查询菜谱菜单分页 */
export function getRecipeMenuPage(params: PageParam) {
  return requestClient.get<PageResult<MealsRecipeMenuApi.RecipeMenu>>(
    `/meals/recipe-menu/page`,
    { params },
  );
}

/** 查询菜谱菜单详情 */
export function getRecipeMenu(id: number) {
  return requestClient.get<MealsRecipeMenuApi.RecipeMenu>(
    `/meals/recipe-menu/get?id=${id}`,
  );
}

/** 新增菜谱菜单 */
export function createRecipeMenu(data: MealsRecipeMenuApi.RecipeMenu) {
  return requestClient.post(`/meals/recipe-menu/create`, data);
}

/** 修改菜谱菜单 */
export function updateRecipeMenu(data: MealsRecipeMenuApi.RecipeMenu) {
  return requestClient.put(`/meals/recipe-menu/update`, data);
}

/** 删除菜谱菜单 */
export function deleteRecipeMenu(id: number) {
  return requestClient.delete(`/meals/recipe-menu/delete?id=${id}`);
}

/** 导出菜谱菜单 Excel */
export function exportRecipeMenu(params: any) {
  return requestClient.download(`/meals/recipe-menu/export-excel`, params);
}

/** ==================== 子表（菜单菜谱） ====================

 /** 获得菜单菜谱分页 */
export function getMenuRecipePage(params: PageParam) {
  return requestClient.get<PageResult<MealsRecipeMenuApi.MenuRecipe>>(
    `/meals/recipe-menu/menu-recipe/page`,
    { params },
  );
}
/** 新增菜谱食材 */
export function createMenuRecipe(data: MealsRecipeMenuApi.MenuRecipe) {
  return requestClient.post(`/meals/recipe-menu/menu-recipe/create`, data);
}

/** 修改菜谱食材 */
export function updateMenuRecipe(data: MealsRecipeMenuApi.MenuRecipe) {
  return requestClient.put(`/meals/recipe-menu/menu-recipe/update`, data);
}

/** 删除菜谱食材 */
export function deleteMenuRecipe(id: number) {
  return requestClient.delete(`/meals/recipe-menu/menu-recipe/delete?id=${id}`);
}

/** 获得菜谱食材 */
export function getMenuRecipe(id: number) {
  return requestClient.get<MealsRecipeMenuApi.MenuRecipe>(
    `/meals/recipe-menu/menu-recipe/get?id=${id}`,
  );
}
