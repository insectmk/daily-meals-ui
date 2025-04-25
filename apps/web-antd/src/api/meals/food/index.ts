import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 食材 VO
export namespace MealsFoodApi {
  /** 食材 */
  export interface Food {
    id: number; // 编号
    name?: string; // 名称
    foodType?: number; // 分类
    foodUnit?: number; // 单位
    memo?: string; // 备注
  }
}

// 食材 API
/** 获取食材精简信息列表 */
export function getSimpleFoodList() {
  return requestClient.get(`/meals/food/list-all-simple`);
}

/** 查询食材分页 */
export function getFoodPage(params: PageParam) {
  return requestClient.get<PageResult<MealsFoodApi.Food>>('/meals/food/page', {
    params,
  });
}

/** 查询食材详情 */
export function getFood(id: number) {
  return requestClient.get<MealsFoodApi.Food>(`/meals/food/get?id=${id}`);
}

/** 新增食材 */
export function createFood(data: MealsFoodApi.Food) {
  return requestClient.post(`/meals/food/create`, data);
}

/** 修改食材 */
export function updateFood(data: MealsFoodApi.Food) {
  return requestClient.put(`/meals/food/update`, data);
}

/** 删除食材 */
export function deleteFood(id: number) {
  return requestClient.delete(`/meals/food/delete?id=${id}`);
}

/** 导出食材 Excel */
export function exportFood(params: any) {
  return requestClient.download(`/meals/food/export-excel`, params);
}
