import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { MealsRecipeApi } from '#/api/meals/recipe';

import { useAccess } from '@vben/access';
import { getRangePickerDefaultProps } from '@vben/utils';

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
      label: '名字',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名字',
      },
    },
    {
      fieldName: 'sex',
      label: '性别',
      rules: 'required',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SYSTEM_USER_SEX, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'birthday',
      label: '出生日期',
      rules: 'required',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'description',
      label: '简介',
      rules: 'required',
      component: 'RichTextarea',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '名字',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入名字',
      },
    },
    {
      fieldName: 'sex',
      label: '性别',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.SYSTEM_USER_SEX, 'number'),
        placeholder: '请选择性别',
      },
    },
    {
      fieldName: 'description',
      label: '简介',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入简介',
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
      minWidth: 120,
    },
    {
      field: 'name',
      title: '名字',
      minWidth: 120,
    },
    {
      field: 'sex',
      title: '性别',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.SYSTEM_USER_SEX },
      },
    },
    {
      field: 'birthday',
      title: '出生日期',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'description',
      title: '简介',
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
      fieldName: 'name',
      label: '名字',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名字',
      },
    },
    {
      fieldName: 'score',
      label: '分数',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分数',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useRecipeFoodGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'studentId',
      label: '学生编号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入学生编号',
      },
    },
    {
      fieldName: 'name',
      label: '名字',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入名字',
      },
    },
    {
      fieldName: 'score',
      label: '分数',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入分数',
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
      field: 'studentId',
      title: '学生编号',
      minWidth: 120,
    },
    {
      field: 'name',
      title: '名字',
      minWidth: 120,
    },
    {
      field: 'score',
      title: '分数',
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
