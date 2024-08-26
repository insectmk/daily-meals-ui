<template>
  <doc-alert title="流程设计器（BPMN）" url="https://doc.iocoder.cn/bpm/model-designer-dingding/" />
  <doc-alert
    title="流程设计器（钉钉、飞书）"
    url="https://doc.iocoder.cn/bpm/model-designer-bpmn/"
  />
  <doc-alert title="选择审批人、发起人自选" url="https://doc.iocoder.cn/bpm/assignee/" />
  <doc-alert title="会签、或签、依次审批" url="https://doc.iocoder.cn/bpm/multi-instance/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="流程标识" prop="key">
        <el-input
          v-model="queryParams.key"
          class="!w-240px"
          clearable
          placeholder="请输入流程标识"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程名称" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入流程名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select
          v-model="queryParams.category"
          class="!w-240px"
          clearable
          placeholder="请选择流程分类"
        >
          <el-option
            v-for="category in categoryList"
            :key="category.code"
            :label="category.name"
            :value="category.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="流程标识" prop="key" width="200" />
      <el-table-column align="center" label="流程名称" prop="name" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="handleBpmnDetail(scope.row)">
            <span>{{ scope.row.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="流程分类" prop="category" width="100">
        <template #default="scope">
          <el-image :src="scope.row.icon" class="h-32px w-32px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="表单信息" prop="formType" width="200">
        <template #default="scope">
          <el-button
            v-if="scope.row.formType === 10"
            link
            type="primary"
            @click="handleFormDetail(scope.row)"
          >
            <span>{{ scope.row.formName }}</span>
          </el-button>
          <el-button
            v-else-if="scope.row.formType === 20"
            link
            type="primary"
            @click="handleFormDetail(scope.row)"
          >
            <span>{{ scope.row.formCustomCreatePath }}</span>
          </el-button>
          <label v-else>暂无表单</label>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" label="最新部署的流程定义">
        <el-table-column
          align="center"
          label="流程版本"
          prop="processDefinition.version"
          width="100"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.processDefinition">
              v{{ scope.row.processDefinition.version }}
            </el-tag>
            <el-tag v-else type="warning">未部署</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="激活状态"
          prop="processDefinition.version"
          width="85"
        >
          <template #default="scope">
            <el-switch
              v-if="scope.row.processDefinition"
              v-model="scope.row.processDefinition.suspensionState"
              :active-value="1"
              :inactive-value="2"
              @change="handleChangeState(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="部署时间" prop="deploymentTime" width="180">
          <template #default="scope">
            <span v-if="scope.row.processDefinition">
              {{ formatDate(scope.row.processDefinition.deploymentTime) }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="240" fixed="right">
        <template #default="scope">
          <el-button
            v-hasPermi="['bpm:model:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            修改流程
          </el-button>
          <el-button
            v-hasPermi="['bpm:model:update']"
            link
            type="primary"
            @click="handleDesign(scope.row)"
          >
            设计流程
          </el-button>
          <el-button
            v-hasPermi="['bpm:task-assign-rule:query']"
            link
            type="primary"
            @click="handleSimpleDesign(scope.row)"
            v-hasPermi="['bpm:model:update']"
          >
            仿钉钉设计流程
          </el-button>
          <el-button
            v-hasPermi="['bpm:model:deploy']"
            link
            type="primary"
            @click="handleDeploy(scope.row)"
          >
            发布流程
          </el-button>
          <el-button
            v-hasPermi="['bpm:process-definition:query']"
            link
            type="primary"
            @click="handleDefinitionList(scope.row)"
          >
            流程定义
          </el-button>
          <el-button
            v-hasPermi="['bpm:model:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改流程 -->
  <ModelForm ref="formRef" @success="getList" />

  <!-- 弹窗：表单详情 -->
  <Dialog v-model="formDetailVisible" title="表单详情" width="800">
    <my-form-create :option="formDetailPreview.option" :rule="formDetailPreview.rule" />
  </Dialog>

  <!-- 弹窗：流程模型图的预览 -->
  <Dialog v-model="bpmnDetailVisible" title="流程图" width="800">
    <MyProcessViewer
      key="designer"
      v-model="bpmnXML"
      :prefix="bpmnControlForm.prefix"
      :value="bpmnXML as any"
      v-bind="bpmnControlForm"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { MyProcessViewer } from '@/components/bpmnProcessDesigner/package'
import * as ModelApi from '@/api/bpm/model'
import * as FormApi from '@/api/bpm/form'
import ModelForm from './ModelForm.vue'
import { setConfAndFields2 } from '@/utils/formCreate'
import { CategoryApi } from '@/api/bpm/category'

defineOptions({ name: 'BpmModel' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  key: undefined,
  name: undefined,
  category: undefined
})
const queryFormRef = ref() // 搜索的表单
const categoryList = ref([]) // 流程分类列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ModelApi.getModelPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ModelApi.deleteModel(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 更新状态操作 */
const handleChangeState = async (row) => {
  const state = row.processDefinition.suspensionState
  try {
    // 修改状态的二次确认
    const id = row.id
    const statusState = state === 1 ? '激活' : '挂起'
    const content = '是否确认' + statusState + '流程名字为"' + row.name + '"的数据项?'
    await message.confirm(content)
    // 发起修改状态
    await ModelApi.updateModelState(id, state)
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.processDefinition.suspensionState = state === 1 ? 2 : 1
  }
}

/** 设计流程 */
const handleDesign = (row) => {
  push({
    name: 'BpmModelEditor',
    query: {
      modelId: row.id
    }
  })
}

const handleSimpleDesign = (row) => {
  push({
    name: 'SimpleWorkflowDesignEditor',
    query: {
      modelId: row.id
    }
  })
}

/** 发布流程 */
const handleDeploy = async (row) => {
  try {
    // 删除的二次确认
    await message.confirm('是否部署该流程！！')
    // 发起部署
    await ModelApi.deployModel(row.id)
    message.success(t('部署成功'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 跳转到指定流程定义列表 */
const handleDefinitionList = (row) => {
  push({
    name: 'BpmProcessDefinition',
    query: {
      key: row.key
    }
  })
}

/** 流程表单的详情按钮操作 */
const formDetailVisible = ref(false)
const formDetailPreview = ref({
  rule: [],
  option: {}
})
const handleFormDetail = async (row) => {
  if (row.formType == 10) {
    // 设置表单
    const data = await FormApi.getForm(row.formId)
    setConfAndFields2(formDetailPreview, data.conf, data.fields)
    // 弹窗打开
    formDetailVisible.value = true
  } else {
    await push({
      path: row.formCustomCreatePath
    })
  }
}

// 流程图的详情按钮操作
const handleBpmnDetail = (row) => {
  // TODO 芋艿：流程组件开发中
  console.log(row)
  ModelApi.getModelApi(row).then((response) => {
    console.log(response, 'response')
    bpmnXML.value = response.bpmnXml
    // 弹窗打开
    showBpmnOpen.value = true
  })
  // message.success('流程组件开发中，预计 2 月底完成')
}

// 点击任务分配按钮
const handleAssignRule = (row) => {
  router.push({
    name: 'BpmTaskAssignRuleList',
    query: {
      modelId: row.id
    }
  })
}

// ========== 新建/修改流程 ==========
const dialogVisible = ref(false)
const dialogTitle = ref('新建模型')
const dialogLoading = ref(false)
const saveForm = ref()
const saveFormRef = ref<FormInstance>()

// 设置标题
const setDialogTile = async (type: string) => {
  dialogTitle.value = t('action.' + type)
  dialogVisible.value = true
}

// 新增操作
const handleCreate = async () => {
  resetForm()
  await setDialogTile('create')
}

// 修改操作
const handleUpdate = async (rowId: number) => {
  resetForm()
  await setDialogTile('edit')
  // 设置数据
  saveForm.value = await ModelApi.getModelApi(rowId)
  if (saveForm.value.category == null) {
    saveForm.value.category = '1'
  } else {
    saveForm.value.category = saveForm.value.category
  }
}

// 提交按钮
const submitForm = async () => {
  // 参数校验
  const elForm = unref(saveFormRef)
  if (!elForm) return
  const valid = await elForm.validate()
  if (!valid) return

  // 提交请求
  dialogLoading.value = true
  try {
    const data = saveForm.value as ModelApi.ModelVO
    if (!data.id) {
      await ModelApi.createModelApi(data)
      message.success(t('common.createSuccess'))
    } else {
      await ModelApi.updateModelApi(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
  } finally {
    // 刷新列表
    await reload()
    dialogLoading.value = false
  }
}

// 重置表单
const resetForm = () => {
  saveForm.value = {
    formType: 10,
    name: '',
    courseSort: '',
    description: '',
    formId: '',
    formCustomCreatePath: '',
    formCustomViewPath: ''
  }
  saveFormRef.value?.resetFields()
}

// ========== 删除 / 更新状态 / 发布流程 ==========
// 删除流程
const handleDelete = (rowId) => {
  message.delConfirm('是否删除该流程！！').then(async () => {
    await ModelApi.deleteModelApi(rowId)
    message.success(t('common.delSuccess'))
    // 刷新列表
    reload()
  })
}

// 更新状态操作
const handleChangeState = (row) => {
  const id = row.id
  const state = row.processDefinition.suspensionState
  const statusState = state === 1 ? '激活' : '挂起'
  const content = '是否确认' + statusState + '流程名字为"' + row.name + '"的数据项?'
  message
    .confirm(content)
    .then(async () => {
      await ModelApi.updateModelStateApi(id, state)
      message.success(t('部署成功'))
      // 刷新列表
      reload()
    })
    .catch(() => {
      // 取消后，进行恢复按钮
      row.processDefinition.suspensionState = state === 1 ? 2 : 1
    })
}

// 发布流程
const handleDeploy = (row) => {
  message.confirm('是否部署该流程！！').then(async () => {
    await ModelApi.deployModelApi(row.id)
    message.success(t('部署成功'))
    // 刷新列表
    reload()
  })
}

// ========== 导入流程 ==========
const uploadRef = ref<UploadInstance>()
let importUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/bpm/model/import'
const uploadHeaders = ref()
const importDialogVisible = ref(false)
const uploadDisabled = ref(false)
const importFormRef = ref<FormInstance>()
const importForm = ref({
  key: '',
  name: '',
  description: ''
})
const handleBpmnDetail = async (row) => {
  const data = await ModelApi.getModel(row.id)
  bpmnXML.value = data.bpmnXml || ''
  bpmnDetailVisible.value = true
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 查询流程分类列表
  categoryList.value = await CategoryApi.getCategorySimpleList()
})
</script>
