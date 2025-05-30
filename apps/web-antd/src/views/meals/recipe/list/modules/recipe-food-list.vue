<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MealsRecipeApi } from '#/api/meals/recipe';

import { h, nextTick, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRecipeFood, getRecipeFoodPage } from '#/api/meals/recipe';
import { $t } from '#/locales';

import { useRecipeFoodGridColumns, useRecipeFoodGridFormSchema } from '../data';
import Demo03CourseForm from './recipe-food-form.vue';

const props = defineProps<{
  recipeId?: number; // 菜谱编号（主表的关联字段）
}>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Demo03CourseForm,
  destroyOnClose: true,
});

/** 创建食谱食材 */
function onCreate() {
  if (!props.recipeId) {
    message.warning('请先选择一个菜谱!');
    return;
  }
  formModalApi.setData({ recipeId: props.recipeId }).open();
}

/** 编辑食谱食材 */
function onEdit(row: MealsRecipeApi.RecipeFood) {
  formModalApi.setData(row).open();
}

/** 删除食谱食材 */
async function onDelete(row: MealsRecipeApi.RecipeFood) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteRecipeFood(row.id as number);
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
}: OnActionClickParams<MealsRecipeApi.RecipeFood>) {
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
    schema: useRecipeFoodGridFormSchema(),
  },
  gridOptions: {
    columns: useRecipeFoodGridColumns(onActionClick),
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (!props.recipeId) {
            return [];
          }
          return await getRecipeFoodPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            recipeId: props.recipeId,
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
  } as VxeTableGridOptions<MealsRecipeApi.RecipeFood>,
});

/** 刷新表格 */
const onRefresh = async () => {
  await gridApi.query();
};

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.recipeId,
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
  <Grid table-title="食谱食材列表">
    <template #toolbar-tools>
      <Button
        :icon="h(Plus)"
        type="primary"
        @click="onCreate"
        v-access:code="['meals:recipe:create']"
      >
        {{ $t('ui.actionTitle.create', ['食谱食材']) }}
      </Button>
    </template>
  </Grid>
</template>
