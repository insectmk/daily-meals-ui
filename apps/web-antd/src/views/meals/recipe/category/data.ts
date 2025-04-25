import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { MealsRecipeCategoryApi } from '#/api/meals/recipecategory';

import { useAccess } from '@vben/access';
import { getRangePickerDefaultProps, handleTree } from '@vben/utils';

import { getRecipeCategoryList } from '#/api/meals/recipecategory';
import { DICT_TYPE, getDictOptions } from '#/utils/dict';

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
      fieldName: 'parentId',
      label: '上级菜谱分类',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: async () => {
          const data = await getRecipeCategoryList({});
          data.unshift({
            id: 0,
            name: '顶级菜谱分类',
          });
          return handleTree(data);
        },
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: '请选择上级菜谱分类',
        treeDefaultExpandAll: true,
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'name',
      label: '分类名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分类名称',
      },
    },
    {
      fieldName: 'picUrl',
      label: '移动端分类图',
      rules: 'required',
      component: 'ImageUpload',
    },
    {
      fieldName: 'sort',
      label: '分类排序',
      component: 'InputNumber',
      componentProps: {
        placeholder: '排序号',
      },
    },
    {
      fieldName: 'status',
      label: '开启状态',
      rules: 'required',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'memo',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '分类名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入名字',
      },
    },
    {
      fieldName: 'status',
      label: '开启状态',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        allowClear: true,
        placeholder: '请选择开启状态',
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
  onActionClick?: OnActionClickFn<MealsRecipeCategoryApi.RecipeCategory>,
): VxeTableGridOptions<MealsRecipeCategoryApi.RecipeCategory>['columns'] {
  return [
    {
      field: 'name',
      title: '分类名称',
      minWidth: 120,
      treeNode: true,
    },
    {
      field: 'picUrl',
      title: '分类图标',
      minWidth: 80,
      maxWidth: 80,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'memo',
      title: '备注',
      minWidth: 120,
    },
    {
      field: 'status',
      title: '开启状态',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'sort',
      title: '分类排序',
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
          nameTitle: '菜谱分类',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '新增下级',
            show: hasAccessByCodes(['meals:recipe-category:create']),
          },
          {
            code: 'edit',
            show: hasAccessByCodes(['meals:recipe-category:update']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['meals:recipe-category:delete']),
            disabled: (row: MealsRecipeCategoryApi.RecipeCategory) => {
              return !!(row.children && row.children.length > 0);
            },
          },
        ],
      },
    },
  ];
}
