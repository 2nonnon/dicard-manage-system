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
            <el-table
                :data="tableData"
                stripe
                max-height="500"
                border
            >
                <el-table-column prop="id" label="id" sortable />
                <el-table-column prop="goodsId" label="商品编号" />
                <el-table-column label="商品图">
                    <template #default="scope">
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="scope.row.coverUrl"
                            fit="cover"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名" />
                <el-table-column prop="price" label="原价" />
                <el-table-column prop="marketPrice" label="现价" />
                <el-table-column prop="tag" label="标签" />
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
        <el-dialog v-model="dialogVisible" width="30%" :before-close="onCancel" center>
            <el-form ref="formRef" :model="form" label-width="auto">
                <el-form-item label="商品编号">
                    <el-input v-model="form.goodsId"></el-input>
                </el-form-item>
                <el-form-item label="商品名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="原价">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="现价">
                    <el-input v-model="form.marketPrice"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-input v-model="form.tag"></el-input>
                </el-form-item>
                <el-form-item label="封面">
                    <el-upload
                        ref="upload"
                        action="http://localhost:9090/files/upload/"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :on-success="handleSuccess"
                    >
                        <el-button type="primary">点击上传</el-button>
                    </el-upload>
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
const upload = ref()
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
    request.get('/goods', {
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
    create: () => request.post('/goods', form),
    update: () => request.put('/goods', form)
}
// function addZero(num) {
//     if (num < 0 || num >= 10) return `${num}`
//     else  return `0${num}`
// }
// function getDate() {
//         let today = new Date()
//         let newDate = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())} ${addZero(today.getHours())}:${addZero(today.getMinutes())}:${addZero(today.getSeconds())}`
//         return newDate
// }

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

    Object.keys(row).forEach(key => {
        form[key] = row[key]
    })
    console.log(form)
    dialogVisible.value = true
    op = 'update'
}
const handleDelete = (index, row) => {
    request.delete(`/goods/${row.id}`).then(res => {
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
const handleSuccess = (res) => {
    console.log(res)
    form.coverUrl = res.data
}
const handleExceed = (files) => {
    upload.value.clearFiles()
    upload.value.handleStart(files[0])
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
.subtable {
    width: 100%;
    padding: .1rem;
    background-color: #f50;
}
.page {
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}
</style>