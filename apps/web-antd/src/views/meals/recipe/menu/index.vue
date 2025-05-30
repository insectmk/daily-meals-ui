<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MealsRecipeMenuApi } from '#/api/meals/recipemenu';

import { h, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Download, Plus } from '@vben/icons';
import { downloadFileFromBlobPart } from '@vben/utils';

import { Button, message, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteRecipeMenu,
  exportRecipeMenu,
  getRecipeMenuPage,
} from '#/api/meals/recipemenu';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import MenuRecipeList from './modules/menu-recipe-list.vue';

/** 子表的列表 */
const subTabsName = ref('menuRecipe'); // 默认选中的tab
const selectRecipe = ref<MealsRecipeMenuApi.RecipeMenu>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建菜谱菜单 */
function onCreate() {
  formModalApi.setData({}).open();
}

/** 编辑菜谱菜单 */
function onEdit(row: MealsRecipeMenuApi.RecipeMenu) {
  formModalApi.setData(row).open();
}

/** 删除菜谱菜单 */
async function onDelete(row: MealsRecipeMenuApi.RecipeMenu) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteRecipeMenu(row.id as number);
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
  const data = await exportRecipeMenu(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '菜谱菜单.xls', source: data });
}

/** 表格操作按钮的回调函数 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<MealsRecipeMenuApi.RecipeMenu>) {
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
          return await getRecipeMenuPage({
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
  } as VxeTableGridOptions<MealsRecipeMenuApi.RecipeMenu>,
  gridEvents: {
    cellClick: ({ row }: { row: MealsRecipeMenuApi.RecipeMenu }) => {
      selectRecipe.value = row;
    },
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <div>
      <Grid table-title="菜谱菜单列表">
        <template #toolbar-tools>
          <Button
            :icon="h(Plus)"
            type="primary"
            @click="onCreate"
            v-access:code="['meals:recipe-menu:create']"
          >
            {{ $t('ui.actionTitle.create', ['菜谱菜单']) }}
          </Button>
          <Button
            :icon="h(Download)"
            type="primary"
            class="ml-2"
            @click="onExport"
            v-access:code="['meals:recipe-menu:export']"
          >
            {{ $t('ui.actionTitle.export') }}
          </Button>
        </template>
      </Grid>

      <!-- 子表的表单 -->
      <Tabs v-model:active-key="subTabsName" class="mt-2">
        <Tabs.TabPane key="menuRecipe" tab="菜单菜谱菜单" force-render>
          <MenuRecipeList :recipe-menu-id="selectRecipe?.id" />
        </Tabs.TabPane>
      </Tabs>
    </div>
  </Page>
</template>
