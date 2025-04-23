<template>
  <el-select v-model="groupId" placeholder="请选择食材" clearable>
    <el-option v-for="group in foodOptions" :key="group.id" :label="group.name" :value="group.id" />
  </el-select>
</template>
<script lang="ts" setup>
import { FoodApi, FoodVO } from '@/api/meals/food'

/** 食材选择框 **/
defineOptions({ name: 'FoodSelect' })

const props = defineProps({
  /** 下拉框选中值 **/
  modelValue: {
    type: Number,
    default: undefined
  }
})
const emit = defineEmits(['update:modelValue'])

const groupId = computed({
  get() {
    return props.modelValue
  },
  set(value: any) {
    emit('update:modelValue', value)
  }
})

const foodOptions = ref<FoodVO[]>([])

const getList = async () => {
  foodOptions.value = await FoodApi.getSimpleFoodList()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
