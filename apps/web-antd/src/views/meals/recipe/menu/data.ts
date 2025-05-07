import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { MealsRecipeMenuApi } from '#/api/meals/recipemenu';

import { useAccess } from '@vben/access';
import { getRangePickerDefaultProps, handleTree } from '@vben/utils';

import { getRecipeCategoryList } from '#/api/meals/recipecategory';

const { hasAccessByCodes } = useAccess();

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'title',
      label: '标题',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入标题',
      },
    },
    {
      fieldName: 'subtitle',
      label: '副标题',
      rules: 'required',
      component: 'Input',
    },
    {
      fieldName: 'picUrl',
      label: '菜单封面图',
      component: 'ImageUpload',
    },
    {
      fieldName: 'menuDesc',
      label: '菜单描述',
      rules: 'required',
      component: 'RichTextarea',
    },
    {
      fieldName: 'recipeIds',
      label: '菜单菜谱',
      rules: 'selectRequired',
      component: 'ApiTreeSelect',
      componentProps: {
        multiple: true,
        allowClear: true,
        api: async () => {
          const data = await getRecipeCategoryList({});
          data.unshift({
            id: 0,
            name: '顶级菜谱',
          });
          return handleTree(data);
        },
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: '请选择菜谱分类',
        treeDefaultExpandAll: true,
      },
    },
    {
      fieldName: 'memo',
      label: '备注',
      component: 'Textarea',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'title',
      label: '标题',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入标题',
      },
    },
    {
      fieldName: 'subtitle',
      label: '副标题',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入副标题',
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(
  onActionClick?: OnActionClickFn<MealsRecipeMenuApi.RecipeMenu>,
): VxeTableGridOptions<MealsRecipeMenuApi.RecipeMenu>['columns'] {
  return [
    {
      field: 'title',
      title: '标题',
      minWidth: 120,
    },
    {
      field: 'subtitle',
      title: '副标题',
      minWidth: 120,
    },
    {
      field: 'picUrl',
      title: '菜单封面图',
      minWidth: 80,
      maxWidth: 80,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'menuDesc',
      title: '菜单描述',
      minWidth: 240,
    },
    {
      field: 'memo',
      title: '备注',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 200,
      align: 'center',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      cellRender: {
        attrs: {
          nameField: 'id',
          nameTitle: '菜谱菜单',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['meals:recipe-menu:update']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['meals:recipe-menu:delete']),
          },
        ],
      },
    },
  ];
}
