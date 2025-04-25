<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MealsFoodApi } from '#/api/meals/food';

import { h } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Download, Plus } from '@vben/icons';
import { downloadFileFromBlobPart } from '@vben/utils';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteFood, exportFood, getFoodPage } from '#/api/meals/food';
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

/** 创建食材 */
function onCreate() {
  formModalApi.setData({}).open();
}

/** 编辑食材 */
function onEdit(row: MealsFoodApi.Food) {
  formModalApi.setData(row).open();
}

/** 删除食材 */
async function onDelete(row: MealsFoodApi.Food) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteFood(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.id]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch {
    hideLoading();
  }
}

/** 导出表格 */
async function onExport() {
  const data = await exportFood(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '食材.xls', source: data });
}

/** 表格操作按钮的回调函数 */
function onActionClick({ code, row }: OnActionClickParams<MealsFoodApi.Food>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
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
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getFoodPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    },
  } as VxeTableGridOptions<MealsFoodApi.Food>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <Grid table-title="食材列表">
      <template #toolbar-tools>
        <Button
          :icon="h(Plus)"
          type="primary"
          @click="onCreate"
          v-access:code="['meals:food:create']"
        >
          {{ $t('ui.actionTitle.create', ['食材']) }}
        </Button>
        <Button
          :icon="h(Download)"
          type="primary"
          class="ml-2"
          @click="onExport"
          v-access:code="['meals:food:export']"
        >
          {{ $t('ui.actionTitle.export') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
