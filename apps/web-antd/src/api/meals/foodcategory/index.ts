import { requestClient } from '#/api/request';

export namespace MealsFoodCategoryApi {
  // 食材分类 VO
  export interface FoodCategory {
    id: number; // 分类编号
    parentId?: number; // 父分类编号
    name?: string; // 分类名称
    picUrl?: string; // 移动端分类图
    sort?: number; // 分类排序
    status?: number; // 开启状态
    children?: FoodCategory[]; // 孩子分类
  }
}

/** 查询食材分类列表 */
export function getFoodCategoryList(params: any) {
  return requestClient.get<MealsFoodCategoryApi.FoodCategory[]>(
    '/meals/food-category/list',
    { params },
  );
}

/** 查询食材分类详情 */
export function getFoodCategory(id: number) {
  return requestClient.get(`/meals/food-category/get?id=${id}`);
}

/** 新增食材分类 */
export function createFoodCategory(data: MealsFoodCategoryApi.FoodCategory) {
  return requestClient.post('/meals/food-category/create', data);
}

/** 修改食材分类 */
export function updateFoodCategory(data: MealsFoodCategoryApi.FoodCategory) {
  return requestClient.put('/meals/food-category/update', data);
}

/** 删除食材分类 */
export function deleteFoodCategory(id: number) {
  return requestClient.delete(`/meals/food-category/delete?id=${id}`);
}

/** 导出食材分类 Excel */
export function exportFoodCategory(params: any) {
  return requestClient.download(`/meals/food-category/export-excel`, params);
}
