import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { dateFormatter } from '@/utils/formatTime'
import * as MailAccountApi from '@/api/system/mail/account'

// 邮箱账号的列表
const accountList = await MailAccountApi.getSimpleMailAccountList()

// CrudSchema：https://doc.iocoder.cn/vue3/crud-schema/
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '编号',
    field: 'id'
  },
  {
    label: '发送时间',
    field: 'sendTime',
    formatter: dateFormatter,
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'daterange',
        defaultTime: [new Date('1 00:00:00'), new Date('1 23:59:59')]
      }
    },
    {
      title: '接收邮箱',
      field: 'toMail',
      isSearch: true,
      table: {
        width: 180,
        slots: {
          default: 'toMail_default'
        }
      }
    },
    {
      title: '用户编号',
      field: 'userId',
      isSearch: true,
      isTable: false
    },
    {
      title: '用户类型',
      field: 'userType',
      dictType: DICT_TYPE.USER_TYPE,
      dictClass: 'number',
      isSearch: true,
      isTable: false
    },
    {
      title: '邮件标题',
      field: 'templateTitle'
    },
    {
      title: '邮件内容',
      field: 'templateContent',
      isTable: false
    },
    {
      title: '邮箱参数',
      field: 'templateParams',
      isTable: false
    },
    {
      title: '发送状态',
      field: 'sendStatus',
      dictType: DICT_TYPE.SYSTEM_MAIL_SEND_STATUS,
      dictClass: 'string',
      isSearch: true
    },
    {
      title: '邮箱账号',
      field: 'accountId',
      isSearch: true,
      isTable: false,
      search: {
        slots: {
          default: 'accountId_search'
        }
      }
    },
    {
      title: '发送邮箱地址',
      field: 'fromMail',
      table: {
        title: '邮箱账号'
      }
    },
    {
      title: '模板编号',
      field: 'templateId',
      isSearch: true
    },
    {
      title: '模板编码',
      field: 'templateCode',
      isTable: false
    },
    {
      title: '模版发送人名称',
      field: 'templateNickname',
      isTable: false
    },
    {
      title: '发送返回的消息编号',
      field: 'sendMessageId',
      isTable: false
    },
    {
      title: '发送异常',
      field: 'sendException',
      isTable: false
    },
    {
      title: '创建时间',
      field: 'createTime',
      isTable: false,
      formatter: 'formatDate'
    }
  },
  {
    label: '接收邮箱',
    field: 'toMail'
  },
  {
    label: '用户编号',
    field: 'userId',
    isSearch: true,
    isTable: false
  },
  {
    label: '用户类型',
    field: 'userType',
    dictType: DICT_TYPE.USER_TYPE,
    dictClass: 'number',
    isSearch: true,
    isTable: false
  },
  {
    label: '邮件标题',
    field: 'templateTitle'
  },
  {
    label: '邮件内容',
    field: 'templateContent',
    isTable: false
  },
  {
    label: '邮箱参数',
    field: 'templateParams',
    isTable: false
  },
  {
    label: '发送状态',
    field: 'sendStatus',
    dictType: DICT_TYPE.SYSTEM_MAIL_SEND_STATUS,
    dictClass: 'string',
    isSearch: true
  },
  {
    label: '邮箱账号',
    field: 'accountId',
    isTable: false,
    search: {
      show: true,
      component: 'Select',
      api: () => accountList,
      componentProps: {
        optionsAlias: {
          labelField: 'mail',
          valueField: 'id'
        }
      }
    }
  },
  {
    label: '发送邮箱地址',
    field: 'fromMail',
    table: {
      label: '邮箱账号'
    }
  },
  {
    label: '模板编号',
    field: 'templateId',
    isSearch: true
  },
  {
    label: '模板编码',
    field: 'templateCode',
    isTable: false
  },
  {
    label: '模版发送人名称',
    field: 'templateNickname',
    isTable: false
  },
  {
    label: '发送返回的消息编号',
    field: 'sendMessageId',
    isTable: false
  },
  {
    label: '发送异常',
    field: 'sendException',
    isTable: false
  },
  {
    label: '创建时间',
    field: 'createTime',
    isTable: false,
    formatter: dateFormatter,
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: '操作',
    field: 'action',
    isDetail: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)
