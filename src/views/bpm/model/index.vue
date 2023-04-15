<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="流程标识" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入流程标识"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="流程名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入流程名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </template>
      <!-- 流程名称 -->
      <template #name_default="{ row }">
        <XTextButton :title="row.name" @click="handleBpmnDetail(row.id)" />
      </template>
      <!-- 流程分类 -->
      <template #category_default="{ row }">
        <DictTag :type="DICT_TYPE.BPM_MODEL_CATEGORY" :value="Number(row?.category)" />
      </template>
      <!-- 表单信息 -->
      <template #formId_default="{ row }">
        <XTextButton
          v-if="row.formType === 10"
          :title="forms.find((form) => form.id === row.formId)?.name || row.formId"
          @click="handleFormDetail(row)"
        />
        <XTextButton v-else :title="row.formCustomCreatePath" @click="handleFormDetail(row)" />
      </template>
      <!-- 流程版本 -->
      <template #version_default="{ row }">
        <el-tag v-if="row.processDefinition">v{{ row.processDefinition.version }}</el-tag>
        <el-tag type="warning" v-else>未部署</el-tag>
      </template>
      <!-- 激活状态 -->
      <template #status_default="{ row }">
        <el-switch
          v-if="row.processDefinition"
          v-model="row.processDefinition.suspensionState"
          :active-value="1"
          :inactive-value="2"
          @change="handleChangeState(row)"
        />
      </template>
      <!-- 操作 -->
      <template #actionbtns_default="{ row }">
        <XTextButton
          preIcon="ep:edit"
          title="修改流程"
          v-hasPermi="['bpm:model:update']"
          @click="handleUpdate(row.id)"
        />
        <XTextButton
          preIcon="ep:setting"
          title="设计流程"
          v-hasPermi="['bpm:model:update']"
          @click="handleDesign(row)"
        />
        <XTextButton
          preIcon="ep:user"
          title="分配规则"
          v-hasPermi="['bpm:task-assign-rule:query']"
          @click="handleAssignRule(row)"
        />
        <XTextButton
          preIcon="ep:position"
          title="发布流程"
          v-hasPermi="['bpm:model:deploy']"
          @click="handleDeploy(row)"
        />
        <XTextButton
          preIcon="ep:aim"
          title="流程定义"
          v-hasPermi="['bpm:process-definition:query']"
          @click="handleDefinitionList(row)"
        />
        <!-- 操作：删除 -->
        <XTextButton
          preIcon="ep:delete"
          :title="t('action.del')"
          v-hasPermi="['bpm:model:delete']"
          @click="handleDelete(row.id)"
        />
      </template>
    </XTable>

    <!-- 对话框(添加 / 修改流程) -->
    <XModal v-model="dialogVisible" :title="dialogTitle" width="600">
      <el-form
        :loading="dialogLoading"
        el-form
        ref="saveFormRef"
        :model="saveForm"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="流程标识" prop="key">
          <el-input
            v-model="saveForm.key"
            placeholder="请输入流标标识"
            style="width: 330px"
            :disabled="!!saveForm.id"
          />
          <el-tooltip
            v-if="!saveForm.id"
            class="item"
            effect="light"
            content="新建后，流程标识不可修改！"
            placement="top"
          >
            <i style="padding-left: 5px" class="el-icon-question"></i>
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="light"
            content="流程标识不可修改！"
            placement="top"
          >
            <i style="padding-left: 5px" class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="流程名称" prop="name">
          <el-input
            v-model="saveForm.name"
            placeholder="请输入流程名称"
            :disabled="!!saveForm.id"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="saveForm.id" label="流程分类" prop="category">
          <el-select
            v-model="saveForm.category"
            placeholder="请选择流程分类"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(dict, index) in getDictOptions(DICT_TYPE.BPM_MODEL_CATEGORY)"
              :key="index"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程描述" prop="description">
          <el-input type="textarea" v-model="saveForm.description" clearable />
        </el-form-item>
        <div v-if="saveForm.id">
          <el-form-item label="表单类型" prop="formType">
            <el-radio-group v-model="saveForm.formType">
              <el-radio
                v-for="dict in getDictOptions(DICT_TYPE.BPM_MODEL_FORM_TYPE)"
                :key="parseInt(dict.value)"
                :label="parseInt(dict.value)"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="saveForm.formType === 10" label="流程表单" prop="formId">
            <el-select v-model="saveForm.formId" clearable style="width: 100%">
              <el-option v-for="form in forms" :key="form.id" :label="form.name" :value="form.id" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="saveForm.formType === 20"
            label="表单提交路由"
            prop="formCustomCreatePath"
          >
            <el-input
              v-model="saveForm.formCustomCreatePath"
              placeholder="请输入表单提交路由"
              style="width: 330px"
            />
            <el-tooltip
              class="item"
              effect="light"
              content="自定义表单的提交路径，使用 Vue 的路由地址，例如说：bpm/oa/leave/create"
              placement="top"
            >
              <i style="padding-left: 5px" class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            v-if="saveForm.formType === 20"
            label="表单查看路由"
            prop="formCustomViewPath"
          >
            <el-input
              v-model="saveForm.formCustomViewPath"
              placeholder="请输入表单查看路由"
              style="width: 330px"
            />
            <el-tooltip
              class="item"
              effect="light"
              content="自定义表单的查看路径，使用 Vue 的路由地址，例如说：bpm/oa/leave/view"
              placement="top"
            >
              <i style="padding-left: 5px" class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <!-- 按钮：保存 -->
        <XButton
          type="primary"
          :loading="dialogLoading"
          @click="submitForm"
          :title="t('action.save')"
        />
        <!-- 按钮：关闭 -->
        <XButton
          :loading="dialogLoading"
          @click="dialogVisible = false"
          :title="t('dialog.close')"
        />
      </template>
    </XModal>

    <!-- 导入流程 -->
    <XModal v-model="importDialogVisible" width="400" title="导入流程">
      <div>
        <el-upload
          ref="uploadRef"
          :action="importUrl"
          :headers="uploadHeaders"
          :drag="true"
          :limit="1"
          :multiple="true"
          :show-file-list="true"
          :disabled="uploadDisabled"
          :on-exceed="handleExceed"
          :on-success="handleFileSuccess"
          :on-error="excelUploadError"
          :auto-upload="false"
          accept=".bpmn, .xml"
          name="bpmnFile"
          :data="importForm"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_MODEL_CATEGORY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['bpm:model:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新建流程
        </el-button>
        <el-button type="success" plain @click="openImportForm" v-hasPermi="['bpm:model:import']">
          <Icon icon="ep:upload" class="mr-5px" /> 导入流程
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="流程标识" align="center" prop="key" width="200" />
      <el-table-column label="流程名称" align="center" prop="name" width="200">
        <template #default="scope">
          <el-button type="primary" link @click="handleBpmnDetail(scope.row)">
            <span>{{ scope.row.name }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="流程分类" align="center" prop="category" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_MODEL_CATEGORY" :value="scope.row.category" />
        </template>
      </el-table-column>
      <el-table-column label="表单信息" align="center" prop="formType" width="200">
        <template #default="scope">
          <el-button
            v-if="scope.row.formType === 10"
            type="primary"
            link
            @click="handleFormDetail(scope.row)"
          >
            <span>{{ scope.row.formName }}</span>
          </el-button>
          <el-button
            v-else-if="scope.row.formType === 20"
            type="primary"
            link
            @click="handleFormDetail(scope.row)"
          >
            <span>{{ scope.row.formCustomCreatePath }}</span>
          </el-button>
          <label v-else>暂无表单</label>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="最新部署的流程定义" align="center">
        <el-table-column
          label="流程版本"
          align="center"
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
          label="激活状态"
          align="center"
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
        <el-table-column label="部署时间" align="center" prop="deploymentTime" width="180">
          <template #default="scope">
            <span v-if="scope.row.processDefinition">
              {{ formatDate(scope.row.processDefinition.deploymentTime) }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['bpm:model:update']"
          >
            修改流程
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDesign(scope.row)"
            v-hasPermi="['bpm:model:update']"
          >
            设计流程
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleAssignRule(scope.row)"
            v-hasPermi="['bpm:task-assign-rule:query']"
          >
            分配规则
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDeploy(scope.row)"
            v-hasPermi="['bpm:model:deploy']"
          >
            发布流程
          </el-button>
          <el-button
            link
            type="primary"
            v-hasPermi="['bpm:process-definition:query']"
            @click="handleDefinitionList(scope.row)"
          >
            流程定义
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['bpm:model:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改流程 -->
  <ModelForm ref="formRef" @success="getList" />

  <!-- 表单弹窗：导入流程 -->
  <ModelImportForm ref="importFormRef" @success="getList" />

  <!-- 弹窗：表单详情 -->
  <Dialog title="表单详情" v-model="formDetailVisible" width="800">
    <form-create :rule="formDetailPreview.rule" :option="formDetailPreview.option" />
  </Dialog>

  <!-- 弹窗：流程模型图的预览 -->
  <Dialog title="流程图" v-model="bpmnDetailVisible" width="800">
    <MyProcessViewer
      key="designer"
      v-model="bpmnXML"
      :value="bpmnXML"
      v-bind="bpmnControlForm"
      :prefix="bpmnControlForm.prefix"
    />
  </Dialog>
</template>

<script setup lang="ts" name="BpmModel">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { MyProcessViewer } from '@/components/bpmnProcessDesigner/package'
import * as ModelApi from '@/api/bpm/model'
import * as FormApi from '@/api/bpm/form'
import ModelForm from './ModelForm.vue'
import ModelImportForm from '@/views/bpm/model/ModelImportForm.vue'
import { setConfAndFields2 } from '@/utils/formCreate'
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

/** 添加/修改操作 */
const importFormRef = ref()
const openImportForm = () => {
  importFormRef.value.open()
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

/** 点击任务分配按钮 */
const handleAssignRule = (row) => {
  push({
    name: 'BpmTaskAssignRuleList',
    query: {
      modelId: row.id
    }
  })
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
onMounted(() => {
  getList()
})
</script>
