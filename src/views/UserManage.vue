<template>
    <div class="container">
        <div class="crud">
            <div class="search">
                <el-input v-model="search" placeholder="请输入" clearable />
                <el-button type="primary" plain @click="handleSearch">搜索</el-button>
            </div>
            <div class="other">
                <el-button type="primary" plain @click="add">新增</el-button>
                <el-button type="primary" plain>导入</el-button>
                <el-button type="primary" plain>导出</el-button>
            </div>
        </div>
        <div class="table">
            <el-table :data="tableData" stripe max-height="500" border table-layout="auto">
                <el-table-column prop="id" label="id" sortable width="80" />
                <el-table-column prop="account" label="账号" />
                <el-table-column prop="username" label="用户名" />
                <el-table-column
                    prop="gender"
                    label="性别"
                    :filters="[
                        { text: '男', value: '男' },
                        { text: '女', value: '女' },
                        { text: '其他', value: '其他' }
                    ]"
                    :filter-method="filterHandler"
                    filter-placement="bottom-end"
                />
                <el-table-column prop="mobile" label="手机号" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="address" label="地址" />
                <el-table-column prop="createTime" sortable label="注册时间" />
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-popconfirm
                            class="confirm"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            :icon="InfoFilled"
                            icon-color="red"
                            title="确认删除?"
                            @confirm="handleDelete(scope.$index, scope.row)"
                        >
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page">
            <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                v-model:page-size="pageSize"
                v-model:current-page="currentPage"
                :total="total"
            ></el-pagination>
        </div>
        <el-dialog v-model="dialogVisible" width="30%" :before-close="onCancel" center>
            <el-form ref="formRef" :model="form" label-width="auto">
                <el-form-item label="账号">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.gender">
                        <el-radio :label="0">男</el-radio>
                        <el-radio :label="1">女</el-radio>
                        <el-radio :label="2">其他</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address" type="textarea"></el-input>
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
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import request from '../utils/request'

const pageSize = ref(10)
const currentPage = ref(1)
const total = ref(1)
const search = ref('')
const tableData = reactive([])
let op = ''

const form = reactive({
    account: '',
    username: '',
    mobile: '',
    email: '',
    gender: '',
    address: '',
})

onMounted(() => {
    load()
})

watch(currentPage, () => {
    load()
})

const filterHandler = (
    value,
    row,
    column
) => {
    console.log(value, row, column)
    const property = column['property']
    return row[property] === value
}

const dialogVisible = ref(false)

const add = () => {
    dialogVisible.value = true
    op = 'create'
}
const load = () => {
    console.log(search.value)
    request.get('/user', {
        params: {
            pageSize: pageSize.value,
            pageNum: currentPage.value,
            search: search.value
        }
    }).then(res => {
        tableData.length = 0
        tableData.push(...res.data.records.map(val => {
            val.address = val.addressList[0]?.address
            return val
        }))
        total.value = res.data.total
        console.log(res);
    })
}
const handleSearch = () => {
    load()
}
const onCancel = () => {
    dialogVisible.value = false
    op = ''
    Object.keys(form).forEach(key => {
        form[key] = ''
    })
}
const submit = {
    create: () => request.post('/user', form),
    update: () => request.put('/user', form)
}
const onSubmit = () => {
    submit[op]().then(res => {
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
        load()
        onCancel()
    })
    console.log('submit!')
}
const handleEdit = (index, row) => {
    console.log(index, row)
    Object.keys(row).forEach(key => {
        form[key] = row[key]
    })
    dialogVisible.value = true
    op = 'update'
}
const handleDelete = (index, row) => {
    request.delete(`/user/${row.id}`).then(res => {
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
        load()
    })
}
</script>

<style scoped>
.container,
.crud,
.search,
.other,
.page {
    display: flex;
}
.container {
    height: 100%;
    padding: 1rem;
    flex-direction: column;
}
.crud {
    margin-bottom: 1rem;
    gap: 12px;
}
.search {
    width: 16rem;
    gap: 12px;
}
.table {
    width: 100%;
    flex: 1;
}
.page {
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}
</style>