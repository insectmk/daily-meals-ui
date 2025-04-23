<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="食材" prop="foodId">
        <RecipeFoodSelect v-model="formData.foodId" @change="onFoodChange" />
      </el-form-item>
      <el-form-item label="单位">
        <dict-tag :type="DICT_TYPE.MEALS_FOOD_UNIT" :value="formData.foodUnit" />
      </el-form-item>
      <el-form-item label="量" prop="amount">
        <el-input v-model="formData.amount" placeholder="请输入量" />
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
import { RecipeApi } from '@/api/meals/recipe'
import { FoodApi } from '@/api/meals/food'
import { DICT_TYPE } from '@/utils/dict'
import RecipeFoodSelect from '@/views/meals/food/list/components/RecipeFoodSelect.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  recipeId: undefined,
  foodId: undefined,
  amount: undefined,
  foodUnit: undefined, // 食材单位
  memo: undefined
})
const formRules = reactive({
  recipeId: [{ required: true, message: '菜谱ID不能为空', trigger: 'blur' }],
  foodId: [{ required: true, message: '食材ID不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '量不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/**
 * 当食材改变时
 * @param value
 */
const onFoodChange = (value: number) => {
  // 获取食材信息，并将单位赋值给表单
  FoodApi.getFood(value).then((res) => {
    formData.value.foodUnit = res.foodUnit
  })
}

/** 打开弹窗 */
const open = async (type: string, id?: number, recipeId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.recipeId = recipeId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await RecipeApi.getRecipeFood(id)
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
    const data = formData.value
    if (formType.value === 'create') {
      await RecipeApi.createRecipeFood(data)
      message.success(t('common.createSuccess'))
    } else {
      await RecipeApi.updateRecipeFood(data)
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
    foodId: undefined,
    amount: undefined,
    memo: undefined,
    foodUnit: undefined
  }
  formRef.value?.resetFields()
}
</script>
