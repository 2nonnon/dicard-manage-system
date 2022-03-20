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
            <el-table :data="tableData" stripe max-height="500" border >
                <el-table-column prop="id" label="id" sortable width="80" />
                <el-table-column prop="serialnumber" label="订单号" />
                <el-table-column prop="userId" label="用户id" />
                <el-table-column prop="receiver" label="收件人" />
                <el-table-column prop="mobile" label="收件人电话" />
                <el-table-column prop="address" label="收货地址" />
                <el-table-column prop="cost" label="订单总额" />
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column prop="paidTime" label="付款时间" />
                <el-table-column prop="sendTime" label="发货时间" />
                <el-table-column prop="receiveTime" label="收货时间" />
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-popconfirm
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
        <el-dialog v-model="dialogVisible" title width="30%" :before-close="onCancel" center>
            <el-form ref="formRef" :model="form" label-width="auto">
                <el-form-item label="用户id">
                    <el-input v-model="form.userId"></el-input>
                </el-form-item>
                <el-form-item label="收件人">
                    <el-input v-model="form.receiver"></el-input>
                </el-form-item>
                <el-form-item label="收件人电话">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="收货地址">
                    <el-input v-model="form.address" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="发货日期">
                    <el-date-picker v-model="form.sendTime" editable="false" type="date" placeholder="选择日期"></el-date-picker>
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
const total = ref(0)
const search = ref('')
const tableData = reactive([])
let op = ''

const form = reactive({})

onMounted(() => {
    load()
})

watch(currentPage, () => {
    load()
})

const dialogVisible = ref(false)

const add = () => {
    dialogVisible.value = true
    op = 'create'
}
const load = () => {
    request.get('/order', {
        params: {
            pageSize: pageSize.value,
            pageNum: currentPage.value,
            search: search.value
        }
    }).then(res => {
        tableData.length = 0
        tableData.push(...res.data.records)
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
    create: () => request.post('/order', form),
    update: () => request.put('/order', form)
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
    request.delete(`/order/${row.id}`).then(res => {
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