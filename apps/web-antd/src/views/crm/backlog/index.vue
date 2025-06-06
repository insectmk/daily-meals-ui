<script lang="ts" setup>
import { computed, onActivated, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Badge, Card, List } from 'ant-design-vue';

import * as ClueApi from '#/api/crm/clue';
import * as ContractApi from '#/api/crm/contract';
import * as CustomerApi from '#/api/crm/customer';
import * as ReceivableApi from '#/api/crm/receivable';
import * as ReceivablePlanApi from '#/api/crm/receivable/plan';
import { DocAlert } from '#/components/doc-alert';

import { useLeftSides } from './data';
import ClueFollowList from './modules/ClueFollowList.vue';
import ContractAuditList from './modules/ContractAuditList.vue';
import ContractRemindList from './modules/ContractRemindList.vue';
import CustomerFollowList from './modules/CustomerFollowList.vue';
import CustomerPutPoolRemindList from './modules/CustomerPutPoolRemindList.vue';
import CustomerTodayContactList from './modules/CustomerTodayContactList.vue';
import ReceivableAuditList from './modules/ReceivableAuditList.vue';
import ReceivablePlanRemindList from './modules/ReceivablePlanRemindList.vue';

defineOptions({ name: 'CrmBacklog' });

const leftMenu = ref('customerTodayContact');

const clueFollowCount = ref(0);
const customerFollowCount = ref(0);
const customerPutPoolRemindCount = ref(0);
const customerTodayContactCount = ref(0);
const contractAuditCount = ref(0);
const contractRemindCount = ref(0);
const receivableAuditCount = ref(0);
const receivablePlanRemindCount = ref(0);

const leftSides = useLeftSides(
  customerTodayContactCount,
  clueFollowCount,
  customerFollowCount,
  customerPutPoolRemindCount,
  contractAuditCount,
  contractRemindCount,
  receivableAuditCount,
  receivablePlanRemindCount,
);

const currentComponent = computed(() => {
  const components = {
    customerTodayContact: CustomerTodayContactList,
    clueFollow: ClueFollowList,
    contractAudit: ContractAuditList,
    receivableAudit: ReceivableAuditList,
    contractRemind: ContractRemindList,
    customerFollow: CustomerFollowList,
    customerPutPoolRemind: CustomerPutPoolRemindList,
    receivablePlanRemind: ReceivablePlanRemindList,
  } as const;
  return components[leftMenu.value as keyof typeof components];
});

/** 侧边点击 */
function sideClick(item: { menu: string }) {
  leftMenu.value = item.menu;
}

/** 获取数量 */
async function getCount() {
  customerTodayContactCount.value =
    await CustomerApi.getTodayContactCustomerCount();
  customerPutPoolRemindCount.value =
    await CustomerApi.getPutPoolRemindCustomerCount();
  customerFollowCount.value = await CustomerApi.getFollowCustomerCount();
  clueFollowCount.value = await ClueApi.getFollowClueCount();
  contractAuditCount.value = await ContractApi.getAuditContractCount();
  contractRemindCount.value = await ContractApi.getRemindContractCount();
  receivableAuditCount.value = await ReceivableApi.getAuditReceivableCount();
  receivablePlanRemindCount.value =
    await ReceivablePlanApi.getReceivablePlanRemindCount();
}

/** 激活时 */
onActivated(async () => {
  getCount();
});

/** 初始化 */
onMounted(async () => {
  getCount();
});
</script>
<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="【通用】跟进记录、待办事项"
        url="https://doc.iocoder.cn/crm/follow-up/"
      />
    </template>
    <div class="flex h-full w-full">
      <Card class="w-1/5">
        <List item-layout="horizontal" :data-source="leftSides">
          <template #renderItem="{ item }">
            <List.Item>
              <List.Item.Meta>
                <template #title>
                  <a @click="sideClick(item)"> {{ item.name }} </a>
                </template>
              </List.Item.Meta>
              <template #extra v-if="item.count.value && item.count.value > 0">
                <Badge :count="item.count.value" />
              </template>
            </List.Item>
          </template>
        </List>
      </Card>
      <component class="ml-4 w-4/5" :is="currentComponent" />
    </div>
  </Page>
</template>
