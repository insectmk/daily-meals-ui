<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InfraDataSourceConfigApi } from '#/api/infra/data-source-config';

import { onMounted } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { ElButton, ElLoading, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDataSourceConfig,
  getDataSourceConfigList,
} from '#/api/infra/data-source-config';
import { $t } from '#/locales';

import { useGridColumns } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 创建数据源 */
function onCreate() {
  formModalApi.setData(null).open();
}

/** 编辑数据源 */
function onEdit(row: InfraDataSourceConfigApi.DataSourceConfig) {
  formModalApi.setData(row).open();
}

/** 删除数据源 */
async function onDelete(row: InfraDataSourceConfigApi.DataSourceConfig) {
  const loadingInstance = ElLoading.service({
    text: $t('ui.actionMessage.deleting', [row.name]),
    fullscreen: true,
  });
  try {
    await deleteDataSourceConfig(row.id as number);
    loadingInstance.close();
    ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    await handleLoadData();
  } catch {
    loadingInstance.close();
  }
}

/** 表格操作按钮的回调函数 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<InfraDataSourceConfigApi.DataSourceConfig>) {
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
  gridOptions: {
    columns: useGridColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    rowConfig: {
      keyField: 'id',
    },
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: getDataSourceConfigList,
      },
    },
  } as VxeTableGridOptions<InfraDataSourceConfigApi.DataSourceConfig>,
});

/** 加载数据 */
async function handleLoadData() {
  await gridApi.query();
}

/** 刷新表格 */
async function onRefresh() {
  await handleLoadData();
}

/** 初始化 */
onMounted(() => {
  handleLoadData();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid table-title="数据源列表">
      <template #toolbar-tools>
        <ElButton
          type="primary"
          @click="onCreate"
          v-access:code="['infra:data-source-config:create']"
        >
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', ['数据源']) }}
        </ElButton>
      </template>
    </Grid>
  </Page>
</template>
