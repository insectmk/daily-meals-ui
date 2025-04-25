<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MealsRecipeApi } from '#/api/meals/recipe';

import { h, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Download, Plus } from '@vben/icons';
import { downloadFileFromBlobPart } from '@vben/utils';

import { Button, message, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRecipe, exportRecipe, getRecipePage } from '#/api/meals/recipe';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import RecipeFoodList from './modules/recipe-food-list.vue';

/** 子表的列表 */
const subTabsName = ref('recipeFood');
const selectRecipe = ref<MealsRecipeApi.Recipe>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建菜谱 */
function onCreate() {
  formModalApi.setData({}).open();
}

/** 编辑菜谱 */
function onEdit(row: MealsRecipeApi.Recipe) {
  formModalApi.setData(row).open();
}

/** 删除菜谱 */
async function onDelete(row: MealsRecipeApi.Recipe) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteRecipe(row.id as number);
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
  const data = await exportRecipe(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '菜谱.xls', source: data });
}

/** 表格操作按钮的回调函数 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<MealsRecipeApi.Recipe>) {
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
    height: '600px',
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getRecipePage({
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
      isCurrent: true,
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    },
  } as VxeTableGridOptions<MealsRecipeApi.Recipe>,
  gridEvents: {
    cellClick: ({ row }: { row: MealsRecipeApi.Recipe }) => {
      selectRecipe.value = row;
    },
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <div>
      <Grid table-title="菜谱列表">
        <template #toolbar-tools>
          <Button
            :icon="h(Plus)"
            type="primary"
            @click="onCreate"
            v-access:code="['meals:recipe:create']"
          >
            {{ $t('ui.actionTitle.create', ['菜谱']) }}
          </Button>
          <Button
            :icon="h(Download)"
            type="primary"
            class="ml-2"
            @click="onExport"
            v-access:code="['meals:recipe:export']"
          >
            {{ $t('ui.actionTitle.export') }}
          </Button>
        </template>
      </Grid>

      <!-- 子表的表单 -->
      <Tabs v-model:active-key="subTabsName" class="mt-2">
        <Tabs.TabPane key="recipeFood" tab="食谱食材" force-render>
          <RecipeFoodList :recipe-id="selectRecipe?.id" />
        </Tabs.TabPane>
      </Tabs>
    </div>
  </Page>
</template>
