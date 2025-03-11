<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="菜谱ID" prop="recipeId">
        <el-input v-model="formData.recipeId" placeholder="请输入菜谱ID" />
      </el-form-item>
      <el-form-item label="计划日" prop="planDate">
        <el-date-picker
          v-model="formData.planDate"
          type="date"
          value-format="x"
          placeholder="选择计划日"
        />
      </el-form-item>
      <el-form-item label="餐次类型" prop="mealType">
        <el-select v-model="formData.mealType" placeholder="请选择餐次类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MEALS_MEAL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="formData.memo" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { DailyPlanApi, DailyPlanVO } from '@/api/meals/dailyplan'

/** 菜谱计划 表单 */
defineOptions({ name: 'DailyPlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  recipeId: undefined,
  planDate: undefined,
  mealType: undefined,
  memo: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DailyPlanApi.getDailyPlan(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as DailyPlanVO
    if (formType.value === 'create') {
      await DailyPlanApi.createDailyPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await DailyPlanApi.updateDailyPlan(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    recipeId: undefined,
    planDate: undefined,
    mealType: undefined,
    memo: undefined
  }
  formRef.value?.resetFields()
}
</script>