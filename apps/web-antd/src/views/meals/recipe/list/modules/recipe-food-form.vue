<script lang="ts" setup>
import type { MealsRecipeApi } from '#/api/meals/recipe';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createRecipeFood,
  getRecipeFood,
  updateRecipeFood,
} from '#/api/meals/recipe';
import { $t } from '#/locales';

import { useRecipeFoodFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MealsRecipeApi.RecipeFood>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['菜谱食材'])
    : $t('ui.actionTitle.create', ['菜谱食材']);
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useRecipeFoodFormSchema(),
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
    const data = (await formApi.getValues()) as MealsRecipeApi.RecipeFood;
    data.recipeId = formData.value?.recipeId;
    try {
      await (formData.value?.id
        ? updateRecipeFood(data)
        : createRecipeFood(data));
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
    let data = modalApi.getData<MealsRecipeApi.RecipeFood>();
    if (!data) {
      return;
    }
    if (data.id) {
      modalApi.lock();
      try {
        data = await getRecipeFood(data.id);
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
