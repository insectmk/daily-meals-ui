import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { InfraJobLogApi } from '#/api/infra/job-log';

import { useAccess } from '@vben/access';
import { formatDateTime } from '@vben/utils';

import dayjs from 'dayjs';

import { DICT_TYPE, getDictOptions } from '#/utils';

const { hasAccessByCodes } = useAccess();

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'handlerName',
      label: '处理器的名字',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入处理器的名字',
      },
    },
    {
      fieldName: 'beginTime',
      label: '开始执行时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        placeholder: '选择开始执行时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: {
          format: 'HH:mm:ss',
          defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
        },
      },
    },
    {
      fieldName: 'endTime',
      label: '结束执行时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        placeholder: '选择结束执行时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: {
          format: 'HH:mm:ss',
          defaultValue: dayjs('23:59:59', 'HH:mm:ss'),
        },
      },
    },
    {
      fieldName: 'status',
      label: '任务状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_JOB_LOG_STATUS, 'number'),
        allowClear: true,
        placeholder: '请选择任务状态',
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns<T = InfraJobLogApi.JobLog>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '日志编号',
      minWidth: 80,
    },
    {
      field: 'jobId',
      title: '任务编号',
      minWidth: 80,
    },
    {
      field: 'handlerName',
      title: '处理器的名字',
      minWidth: 180,
    },
    {
      field: 'handlerParam',
      title: '处理器的参数',
      minWidth: 140,
    },
    {
      field: 'executeIndex',
      title: '第几次执行',
      minWidth: 100,
    },
    {
      field: 'beginTime',
      title: '执行时间',
      minWidth: 280,
      formatter: ({ row }) => {
        return `${formatDateTime(row.beginTime)} ~ ${formatDateTime(row.endTime)}`;
      },
    },
    {
      field: 'duration',
      title: '执行时长',
      minWidth: 120,
      formatter: ({ row }) => {
        return `${row.duration} 毫秒`;
      },
    },
    {
      field: 'status',
      title: '任务状态',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_JOB_LOG_STATUS },
      },
    },
    {
      field: 'operation',
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'id',
          nameTitle: '日志',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'detail',
            text: '详细',
            show: hasAccessByCodes(['infra:job:query']),
          },
        ],
      },
    },
  ];
}
