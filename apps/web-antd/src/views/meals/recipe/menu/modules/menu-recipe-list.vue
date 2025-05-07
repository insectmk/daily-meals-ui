<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MealsRecipeMenuApi } from '#/api/meals/recipemenu';

import { h, nextTick, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMenuRecipe, getMenuRecipePage } from '#/api/meals/recipemenu';
import { $t } from '#/locales';

import { useMenuRecipeGridColumns, useMenuRecipeGridFormSchema } from '../data';
import Demo03CourseForm from './menu-recipe-form.vue';

const props = defineProps<{
  // 菜谱菜单ID
  recipeMenuId: {
    required: true;
    type: Number;
  }; // 菜单菜谱编号（主表的关联字段）
}>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Demo03CourseForm,
  destroyOnClose: true,
});

/** 创建菜单菜谱 */
function onCreate() {
  if (!props.recipeMenuId) {
    message.warning('请先选择一个菜谱!');
    return;
  }
  formModalApi.setData({ recipeMenuId: props.recipeMenuId }).open();
}

/** 编辑菜单菜谱 */
function onEdit(row: MealsRecipeMenuApi.MenuRecipe) {
  formModalApi.setData(row).open();
}

/** 删除菜单菜谱 */
async function onDelete(row: MealsRecipeMenuApi.MenuRecipe) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteMenuRecipe(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.id]),
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
}: OnActionClickParams<MealsRecipeMenuApi.MenuRecipe>) {
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
    schema: useMenuRecipeGridFormSchema(),
  },
  gridOptions: {
    columns: useMenuRecipeGridColumns(onActionClick),
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (!props.recipeMenuId) {
            return [];
          }
          return await getMenuRecipePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            recipeMenuId: props.recipeMenuId,
            ...formValues,
          });
        },
      },
    },
    pagerConfig: {
      enabled: true,
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    },
    height: '600px',
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
  } as VxeTableGridOptions<MealsRecipeMenuApi.MenuRecipe>,
});

/** 刷新表格 */
const onRefresh = async () => {
  await gridApi.query();
};

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.recipeMenuId,
  async (val) => {
    if (!val) {
      return;
    }
    await nextTick();
    await onRefresh();
  },
  { immediate: true },
);
</script>

<template>
  <FormModal @success="onRefresh" />
  <Grid table-title="菜单菜谱列表">
    <template #toolbar-tools>
      <Button
        :icon="h(Plus)"
        type="primary"
        @click="onCreate"
        v-access:code="['meals:recipe-menu:create']"
      >
        {{ $t('ui.actionTitle.create', ['菜单菜谱']) }}
      </Button>
    </template>
  </Grid>
</template>
