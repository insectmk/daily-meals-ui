<script lang="ts" setup>
import type { InfraJobLogApi } from '#/api/infra/job-log';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { getJobLog } from '#/api/infra/job-log';
import { useDescription } from '#/components/description';

import { useDetailSchema } from '../data';

const formData = ref<InfraJobLogApi.JobLog>();

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = modalApi.getData<{ id: number }>();
    if (!data?.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getJobLog(data.id);
    } finally {
      modalApi.unlock();
    }
  },
});

const [Description] = useDescription({
  componentProps: {
    bordered: true,
    column: 1,
    class: 'mx-4',
  },
  schema: useDetailSchema(),
});
</script>

<template>
  <Modal
    title="日志详情"
    class="w-1/2"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <Description :data="formData" />
  </Modal>
</template>
