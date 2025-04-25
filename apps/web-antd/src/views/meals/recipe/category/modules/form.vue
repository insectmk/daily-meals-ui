<script lang="ts" setup>
import type { MealsRecipeCategoryApi } from '#/api/meals/recipecategory';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createRecipeCategory,
  getRecipeCategory,
  updateRecipeCategory,
} from '#/api/meals/recipecategory';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MealsRecipeCategoryApi.RecipeCategory>();
const parentId = ref<number>(); // 新增下级时的父级 ID

const getTitle = computed(() => {
  if (formData.value?.id) {
    return $t('ui.actionTitle.edit', ['示例分类']);
  }
  return parentId.value
    ? $t('ui.actionTitle.create', ['下级示例分类'])
    : $t('ui.actionTitle.create', ['示例分类']);
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data =
      (await formApi.getValues()) as MealsRecipeCategoryApi.RecipeCategory;
    try {
      await (formData.value?.id
        ? updateRecipeCategory(data)
        : createRecipeCategory(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success({
        content: $t('ui.actionMessage.operationSuccess'),
        key: 'action_process_msg',
      });
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }

    // 加载数据
    let data = modalApi.getData<MealsRecipeCategoryApi.RecipeCategory>();
    if (!data) {
      return;
    }

    if (data.id) {
      // 编辑
      modalApi.lock();
      try {
        data = await getRecipeCategory(data.id);
      } finally {
        modalApi.lock(false);
      }
    }
    // 设置到 values
    formData.value = data;
    await formApi.setValues(formData.value);
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
