<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MealsRecipeCategoryApi } from '#/api/meals/recipecategory';

import { h, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Download, Plus } from '@vben/icons';
import { downloadFileFromBlobPart } from '@vben/utils';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteRecipeCategory,
  exportRecipeCategory,
  getRecipeCategoryList,
} from '#/api/meals/recipecategory';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 切换树形展开/收缩状态 */
const isExpanded = ref(true);
function toggleExpand() {
  isExpanded.value = !isExpanded.value;
  gridApi.grid.setAllTreeExpand(isExpanded.value);
}

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function onExport() {
  const data = await exportRecipeCategory(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '菜谱分类.xls', source: data });
}

/** 创建菜谱分类 */
function onCreate() {
  formModalApi.setData(null).open();
}

/** 编辑菜谱分类 */
function onEdit(row: MealsRecipeCategoryApi.RecipeCategory) {
  formModalApi.setData(row).open();
}

/** 新增下级菜谱分类 */
function onAppend(row: MealsRecipeCategoryApi.RecipeCategory) {
  formModalApi.setData({ parentId: row.id }).open();
}

/** 删除菜谱分类 */
async function onDelete(row: MealsRecipeCategoryApi.RecipeCategory) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteRecipeCategory(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_process_msg',
    });
    onRefresh();
  } catch {
    hideLoading();
  }
}

/** 表格操作按钮的回调函数 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<MealsRecipeCategoryApi.RecipeCategory>) {
  switch (code) {
    case 'append': {
      onAppend(row);
      break;
    }
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
    treeConfig: {
      parentField: 'parentId',
      rowField: 'id',
      transform: true,
      expandAll: true,
      reserve: true,
    },
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_, formValues) => {
          return await getRecipeCategoryList(formValues);
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
  } as VxeTableGridOptions<MealsRecipeCategoryApi.RecipeCategory>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <Grid table-title="菜谱分类列表">
      <template #toolbar-tools>
        <Button @click="toggleExpand" class="mr-2">
          {{ isExpanded ? '收缩' : '展开' }}
        </Button>
        <Button
          :icon="h(Plus)"
          type="primary"
          @click="onCreate"
          v-access:code="['meals:recipe-category:create']"
        >
          {{ $t('ui.actionTitle.create', ['菜谱分类']) }}
        </Button>
        <Button
          :icon="h(Download)"
          type="primary"
          class="ml-2"
          @click="onExport"
          v-access:code="['meals:recipe-category:export']"
        >
          {{ $t('ui.actionTitle.export') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
