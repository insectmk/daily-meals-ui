import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { MealsFoodApi } from '#/api/meals/food';

import { useAccess } from '@vben/access';
import { handleTree } from '@vben/utils';

import { getFoodCategoryList } from '#/api/meals/foodcategory';
import { getRangePickerDefaultProps } from '#/utils';
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
      fieldName: 'name',
      label: '名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名称',
      },
    },
    {
      fieldName: 'foodType',
      label: '分类',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.MEALS_FOOD_TYPE, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'foodCategory',
      label: '食材分类',
      rules: 'selectRequired',
      component: 'ApiTreeSelect',
      componentProps: {
        multiple: true,
        allowClear: true,
        api: async () => {
          const data = await getFoodCategoryList({});
          data.unshift({
            id: 0,
            name: '顶级食材分类',
          });
          return handleTree(data);
        },
        class: 'w-full',
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: '请选择食材分类',
        treeDefaultExpandAll: true,
      },
    },
    {
      fieldName: 'foodUnit',
      label: '单位',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.MEALS_FOOD_UNIT, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
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
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入名称',
      },
    },
    {
      fieldName: 'foodType',
      label: '分类',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.MEALS_FOOD_TYPE, 'number'),
        placeholder: '请选择分类',
      },
    },
    {
      fieldName: 'foodUnit',
      label: '单位',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.MEALS_FOOD_UNIT, 'number'),
        placeholder: '请选择单位',
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
  onActionClick?: OnActionClickFn<MealsFoodApi.Food>,
): VxeTableGridOptions<MealsFoodApi.Food>['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      minWidth: 120,
    },
    {
      field: 'name',
      title: '名称',
      minWidth: 120,
    },
    {
      field: 'foodType',
      title: '分类',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MEALS_FOOD_TYPE },
      },
    },
    {
      field: 'foodUnit',
      title: '单位',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MEALS_FOOD_UNIT },
      },
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
          nameTitle: '食材',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['meals:food:update']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['meals:food:delete']),
          },
        ],
      },
    },
  ];
}
