<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="简介" prop="recipeDesc">
        <el-input v-model="formData.recipeDesc" type="textarea" placeholder="请输入简介" />
      </el-form-item>
      <el-form-item label="教程" prop="recipeStep">
        <Editor v-model="formData.recipeStep" height="150px" />
      </el-form-item>
      <el-form-item label="菜谱类型" prop="recipeType">
        <el-select v-model="formData.recipeType" placeholder="请选择菜谱类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MEALS_RECIPE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="烹饪难度" prop="recipeLevel">
        <el-select v-model="formData.recipeLevel" placeholder="请选择烹饪难度">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MEALS_RECIPE_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品封面图" prop="picUrl">
        <UploadImg v-model="formData.picUrl" :disabled="isDetail" height="80px" />
      </el-form-item>
      <el-form-item label="商品轮播图" prop="sliderPicUrls">
        <UploadImgs v-model="formData.sliderPicUrls" :disabled="isDetail" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="formData.sort" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="formData.memo" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
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
import { RecipeApi, RecipeVO } from '@/api/meals/recipe'

/** 菜谱 表单 */
defineOptions({ name: 'RecipeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  recipeDesc: undefined,
  recipeStep: undefined,
  recipeType: undefined,
  recipeLevel: undefined,
  sort: undefined,
  memo: undefined,
  status: undefined,
  picUrl: '', // 菜谱封面图
  sliderPicUrls: [] // 菜谱轮播图
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  recipeDesc: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  recipeStep: [{ required: true, message: '教程不能为空', trigger: 'blur' }],
  recipeType: [{ required: true, message: '菜谱类型不能为空', trigger: 'change' }],
  recipeLevel: [{ required: true, message: '烹饪难度不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  picUrl: [{ required: true, message: '菜谱封面图不能为空', trigger: 'blur' }]
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
      formData.value = await RecipeApi.getRecipe(id)
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
    const data = formData.value as unknown as RecipeVO
    if (formType.value === 'create') {
      await RecipeApi.createRecipe(data)
      message.success(t('common.createSuccess'))
    } else {
      await RecipeApi.updateRecipe(data)
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
    name: undefined,
    recipeDesc: undefined,
    recipeStep: undefined,
    recipeType: undefined,
    recipeLevel: undefined,
    sort: undefined,
    memo: undefined,
    status: undefined
  }
  formRef.value?.resetFields()
}
</script>
