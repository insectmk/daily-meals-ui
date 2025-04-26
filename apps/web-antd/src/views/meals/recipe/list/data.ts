import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { MealsRecipeApi } from '#/api/meals/recipe';

import { useAccess } from '@vben/access';
import { getRangePickerDefaultProps, handleTree } from '@vben/utils';

import { getSimpleFoodList } from '#/api/meals/food';
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
      fieldName: 'name',
      label: '名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名称',
      },
    },
    {
      fieldName: 'recipeDesc',
      label: '简介',
      rules: 'required',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入简介',
      },
    },
    {
      fieldName: 'recipeStep',
      label: '教程',
      rules: 'required',
      component: 'RichTextarea',
      componentProps: {
        placeholder: '请输入教程',
      },
    },
    {
      fieldName: 'recipeType',
      label: '菜谱类型',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.MEALS_RECIPE_TYPE, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'recipeCategory',
      label: '菜谱分类',
      rules: 'selectRequired',
      component: 'ApiTreeSelect',
      componentProps: {
        multiple: true,
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
        placeholder: '请选择菜谱分类',
        treeDefaultExpandAll: true,
      },
    },
    {
      fieldName: 'recipeLevel',
      label: '烹饪难度',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.MEALS_RECIPE_LEVEL, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'picUrl',
      label: '菜谱封面图',
      rules: 'required',
      component: 'ImageUpload',
    },
    {
      fieldName: 'sliderPicUrls',
      label: '菜谱轮播图',
      component: 'ImageUpload',
      componentProps: {
        multiple: true,
        maxSize: 5,
        maxNumber: 5,
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
    {
      fieldName: 'status',
      label: '状态',
      rules: 'required',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'sort',
      label: '排序',
      component: 'InputNumber',
      componentProps: {
        placeholder: '排序',
      },
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
        placeholder: '请输入名字',
      },
    },
    {
      fieldName: 'recipeType',
      label: '菜谱类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.MEALS_RECIPE_TYPE, 'number'),
        placeholder: '请选择菜谱类型',
      },
    },
    {
      fieldName: 'recipeLevel',
      label: '烹饪难度',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.MEALS_RECIPE_LEVEL, 'number'),
        placeholder: '请选择烹饪难度',
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
  onActionClick?: OnActionClickFn<MealsRecipeApi.Recipe>,
): VxeTableGridOptions<MealsRecipeApi.Recipe>['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      minWidth: 80,
    },
    {
      field: 'name',
      title: '名称',
      minWidth: 120,
    },
    {
      field: 'picUrl',
      title: '封面',
      minWidth: 80,
      maxWidth: 80,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'recipeDesc',
      title: '简介',
      minWidth: 180,
    },
    {
      field: 'recipeStep',
      title: '教程',
      minWidth: 240,
    },
    {
      field: 'recipeType',
      title: '菜谱类型',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MEALS_RECIPE_TYPE },
      },
    },
    {
      field: 'recipeLevel',
      title: '烹饪难度',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MEALS_RECIPE_LEVEL },
      },
    },
    {
      field: 'memo',
      title: '备注',
      minWidth: 180,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'sort',
      title: '排序',
      minWidth: 80,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 140,
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
          nameTitle: '学生',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['meals:recipe:update']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['meals:recipe:delete']),
          },
        ],
      },
    },
  ];
}

// ==================== 子表（学生课程） ====================

/** 新增/修改的表单 */
export function useRecipeFoodFormSchema(): VbenFormSchema[] {
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
      fieldName: 'foodId',
      label: '食材',
      rules: 'selectRequired',
      component: 'ApiSelect',
      componentProps: {
        multiple: true,
        allowClear: true,
        api: async () => {
          return await getSimpleFoodList();
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
      fieldName: 'foodUnit',
      label: '单位',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.MEALS_FOOD_UNIT, 'number'),
        disabled: true,
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'amount',
      label: '量',
      rules: 'required',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入量',
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
export function useRecipeFoodGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'amount',
      label: '量',
      component: 'InputNumber',
      componentProps: {
        allowClear: true,
        placeholder: '请输入量',
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
export function useRecipeFoodGridColumns(
  onActionClick?: OnActionClickFn<MealsRecipeApi.RecipeFood>,
): VxeTableGridOptions<MealsRecipeApi.RecipeFood>['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      minWidth: 120,
    },
    {
      field: 'foodName',
      title: '食材名称',
      minWidth: 120,
    },
    {
      field: 'foodUnit',
      title: '食材单位',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MEALS_FOOD_UNIT },
      },
    },
    {
      field: 'memo',
      title: '备注',
      minWidth: 240,
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
          nameTitle: '学生课程',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['meals:recipe:update']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['meals:recipe:delete']),
          },
        ],
      },
    },
  ];
}
