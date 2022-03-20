<template>
  <div class="container">
    <div class="crud">
      <el-button type="primary" plain @click="append({ id: 0 })">新增一级分类</el-button>
      <el-button type="primary" plain @click="attach()">添加分类到商品</el-button>
    </div>
    <div class="category">
      <el-tree
        ref="treeRef"
        :data="dataSource"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :expand-on-click-node="true"
        :indent="25"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button size="small" @click="append(data)" v-if="data.parentId === 0">添加子分类</el-button>
              <el-button size="small" @click="edit(data)">编辑</el-button>
              <el-button size="small" type="danger" @click="remove(node, data)">删除</el-button>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
    <el-dialog v-model="dialogVisible" title width="30%" :before-close="onCancel" center>
      <el-form ref="formRef" :model="form" label-width="auto">
        <el-form-item label="分类名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="上级id">
          <el-input v-model="form.parentId"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import request from '../utils/request';
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue';

const dataSource = reactive([])
const form = reactive({})
const dialogVisible = ref(false)
let op = ''
const defaultProps = {
  children: 'children',
  label: 'name',
}

const treeRef = ref()

const attach = () => {
  console.log(treeRef.value.getCheckedNodes(false, false))
}

const submit = {
  create: (form) => request.post('/category', form),
  update: (form) => request.put('/category', form)
}
const onCancel = () => {
  dialogVisible.value = false
  op = ''
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}
const onSubmit = () => {
  submit[op](form).then(res => {
    console.log(res)
    if (res.code === '0') {
      ElMessage({
        message: '操作成功',
        type: 'success',
      })
    } else {
      ElMessage.error(res.msg)
    }
  }).finally(() => {
    onCancel()
    load()
  })
  console.log('submit!')
}
const append = (data) => {
  console.log(data)
  form.parentId = data.id
  dialogVisible.value = true
  op = 'create'
}

const edit = (data) => {
  console.log(data)
  form.id = data.id
  form.name = data.name
  form.parentId = data.parentId
  dialogVisible.value = true
  op = 'update'
}

const reFind = (arr) => {
  const ids = []
  const re = (arr) => {
    if (!arr || arr.length === 0) { return }
    arr.forEach(val => {
      ids.push(val.id)
      re(val.children)
    })
  }
  re(arr)
  return ids
}

const remove = (node, data) => {
  if (data.parentId === 0) {
    const index = dataSource.findIndex((d) => d.id === data.id)
    const removed = dataSource.splice(index, 1)
    const ids = reFind(removed)
    console.log(ids)
    request.post(`/category/deleteBatch`, ids).then(res => {
      console.log(res);
    })
  } else {
    const children = node.parent.data.children
    const index = children.findIndex((d) => d.id === data.id)
    const removed = children.splice(index, 1)
    const ids = reFind(removed)
    console.log(ids)
    request.post(`/category/deleteBatch`, ids).then(res => {
      console.log(res);
    })
  }
}

const load = () => {
  request.get('/category').then(res => {
    console.log(res);
    dataSource.length = 0
    dataSource.push(...res.data)
  })
}
load()
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 1.5rem;
}
.crud {
  margin-bottom: 1rem;
}
.category {
  height: 27rem;
  border: 1px solid #d3d6da;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-y: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  padding-right: 0.5rem;
}
/* .el-button:deep(span) {
  font-size: 1rem;
} */
</style>