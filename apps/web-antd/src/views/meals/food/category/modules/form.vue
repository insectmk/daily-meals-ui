<script lang="ts" setup>
import type { MealsFoodCategoryApi } from '#/api/meals/foodcategory';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createFoodCategory,
  getFoodCategory,
  updateFoodCategory,
} from '#/api/meals/foodcategory';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MealsFoodCategoryApi.FoodCategory>();
const parentId = ref<number>(); // 新增下级时的父级 ID

const getTitle = computed(() => {
  if (formData.value?.id) {
    return $t('ui.actionTitle.edit', ['食材分类']);
  }
  return parentId.value
    ? $t('ui.actionTitle.create', ['下级食材分类'])
    : $t('ui.actionTitle.create', ['食材分类']);
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
      (await formApi.getValues()) as MealsFoodCategoryApi.FoodCategory;
    try {
      await (formData.value?.id
        ? updateFoodCategory(data)
        : createFoodCategory(data));
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
    let data = modalApi.getData<MealsFoodCategoryApi.FoodCategory>();
    if (!data) {
      return;
    }

    if (data.id) {
      // 编辑
      modalApi.lock();
      try {
        data = await getFoodCategory(data.id);
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
