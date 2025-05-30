<script lang="ts" setup>
import type { MealsFoodApi } from '#/api/meals/food';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createFood, getFood, updateFood } from '#/api/meals/food';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<MealsFoodApi.Food>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['食材'])
    : $t('ui.actionTitle.create', ['食材']);
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
    const data = (await formApi.getValues()) as MealsFoodApi.Food;
    try {
      await (formData.value?.id ? updateFood(data) : createFood(data));
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
    let data = modalApi.getData<MealsFoodApi.Food>();
    if (!data) {
      return;
    }
    if (data.id) {
      modalApi.lock();
      try {
        data = await getFood(data.id);
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
