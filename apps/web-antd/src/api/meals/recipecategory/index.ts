import { requestClient } from '#/api/request';

// 菜谱分类 VO
export namespace MealsRecipeCategoryApi {
  export interface RecipeCategory {
    id: number; // 分类编号
    parentId?: number; // 父分类编号
    name?: string; // 分类名称
    picUrl?: string; // 移动端分类图
    sort?: number; // 分类排序
    status?: number; // 开启状态
    memo?: string; // 备注
    children?: RecipeCategory[]; // 孩子分类
  }
}

// 菜谱分类 API
/** 查询菜谱分类列表 */
export function getRecipeCategoryList(params: any) {
  return requestClient.get<MealsRecipeCategoryApi.RecipeCategory[]>(
    '/meals/recipe-category/list',
    { params },
  );
}

/** 查询菜谱分类详情 */
export function getRecipeCategory(id: number) {
  return requestClient.get<MealsRecipeCategoryApi.RecipeCategory>(
    `/meals/recipe-category/get?id=${id}`,
  );
}

/** 新增菜谱分类 */
export function createRecipeCategory(
  data: MealsRecipeCategoryApi.RecipeCategory,
) {
  return requestClient.post(`/meals/recipe-category/create`, data);
}

/** 修改菜谱分类 */
export function updateRecipeCategory(
  data: MealsRecipeCategoryApi.RecipeCategory,
) {
  return requestClient.put(`/meals/recipe-category/update`, data);
}

/** 删除菜谱分类 */
export function deleteRecipeCategory(id: number) {
  return requestClient.delete(`/meals/recipe-category/delete?id=${id}`);
}

/** 导出菜谱分类 Excel */
export function exportRecipeCategory(params: any) {
  return requestClient.download(`/meals/recipe-category/export-excel`, params);
}
