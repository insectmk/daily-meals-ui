<script setup lang="ts">
import { AntdDingTalk, MdiGithub, MdiQqchat, MdiWechat } from '@vben/icons';
import { $t } from '@vben/locales';

import { VbenIconButton } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'ThirdPartyLogin',
});

const emit = defineEmits<{
  thirdLogin: [type: number];
}>();

/**
 * 处理第三方登录点击
 *
 * @param type 第三方平台类型
 */
function handleThirdLogin(type: number) {
  emit('thirdLogin', type);
}
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xs uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>

    <div class="mt-4 flex flex-wrap justify-center">
      <VbenIconButton class="mb-3" @click="handleThirdLogin(30)">
        <MdiWechat />
      </VbenIconButton>
      <VbenIconButton class="mb-3" @click="handleThirdLogin(20)">
        <AntdDingTalk />
      </VbenIconButton>
      <VbenIconButton class="mb-3" @click="handleThirdLogin(0)">
        <MdiQqchat />
      </VbenIconButton>
      <VbenIconButton class="mb-3" @click="handleThirdLogin(0)">
        <MdiGithub />
      </VbenIconButton>
    </div>
  </div>
</template>
