<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemNoticeApi } from '#/api/system/notice';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteNotice, getNoticePage, pushNotice } from '#/api/system/notice';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建公告 */
function onCreate() {
  formModalApi.setData(null).open();
}

/** 编辑公告 */
function onEdit(row: SystemNoticeApi.Notice) {
  formModalApi.setData(row).open();
}

/** 删除公告 */
async function onDelete(row: SystemNoticeApi.Notice) {
  const loadingInstance = ElMessage({
    message: $t('ui.actionMessage.deleting', [row.title]),
    type: 'info',
    duration: 0,
  });
  try {
    await deleteNotice(row.id as number);
    loadingInstance.close();
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.title]));
    onRefresh();
  } catch {
    loadingInstance.close();
  }
}

/** 推送公告 */
async function onPush(row: SystemNoticeApi.Notice) {
  const loadingInstance = ElMessage({
    message: $t('ui.actionMessage.processing', ['推送']),
    type: 'info',
    duration: 0,
  });
  try {
    await pushNotice(row.id as number);
    loadingInstance.close();
    ElMessage.success($t('ui.actionMessage.operationSuccess'));
  } catch {
    loadingInstance.close();
  }
}

/** 表格操作按钮的回调函数 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemNoticeApi.Notice>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'push': {
      onPush(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getNoticePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    },
  } as VxeTableGridOptions<SystemNoticeApi.Notice>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid table-title="公告列表">
      <template #toolbar-tools>
        <ElButton
          type="primary"
          @click="onCreate"
          v-access:code="['system:notice:create']"
        >
          <Plus class="mr-2 size-5" />
          {{ $t('ui.actionTitle.create', ['公告']) }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
