<template>
  <doc-alert title="地区 & IP" url="https://doc.iocoder.cn/area-and-ip/" />

  <!-- 操作栏 -->
  <ContentWrap>
    <el-button type="primary" plain @click="openForm()">
      <Icon icon="ep:plus" class="mr-5px" /> IP 查询
    </el-button>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div style="width: 100%; height: 700px">
      <!-- AutoResizer 自动调节大小 -->
      <el-auto-resizer>
        <template #default="{ height, width }">
          <!-- Virtualized Table 虚拟化表格：高性能，解决表格在大数据量下的卡顿问题 -->
          <el-table-v2
            :columns="columns"
            :data="list"
            :width="width"
            :height="height"
            expand-column-key="id"
          />
        </template>
      </el-auto-resizer>
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AreaForm ref="formRef" />
</template>
<script setup lang="tsx" name="SystemArea">
import type { Column } from 'element-plus'
import AreaForm from './AreaForm.vue'
import * as AreaApi from '@/api/system/area'

<script lang="ts" setup name="Area">
import * as areaApi from '@/api/system/area'
import type { FormInstance } from 'element-plus'
// import { allSchemas } from './area.data'
// import { getAreaByIp, getAreaTree } from '@/api/system/area'
// 遮罩层
const loading = ref(true)
// 地区列表
const list = ref([])
// 弹出层标题
// const title = ref('')
// 是否显示弹出层
const open = ref(false)
// 重新渲染表格状态
const refreshTable = ref(true)
// 表单参数
const form = ref({
  ip: undefined,
  result: undefined
})
const formRef = ref<FormInstance>()
// 表单校验
const rules = ref({
  ip: [{ required: true, message: 'IP 地址不能为控', trigger: 'blur' }]
})
const message = useMessage() // 消息弹窗

// const treeConfig = {
//   transform: true,
//   rowField: 'id',
//   parentField: 'id'
//   // expandAll: true
// }

// const [registerTable, { reload }] = useXTable({
//   allSchemas: allSchemas,
//   treeConfig: treeConfig,
//   getListApi: areaApi.getAreaTree
// })

/** 查询列表 */
const getList = async () => {
  list.value = await AreaApi.getAreaTree()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = () => {
  formRef.value.open()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
