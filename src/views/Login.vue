<template>
    <div class="container">
        <div class="login">
            <div class="title">后台管理系统</div>
            <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" :size="formSize">
                <el-form-item prop="account">
                    <el-input placeholder="账号" v-model="form.account" :prefix-icon="Avatar"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        placeholder="密码"
                        v-model="form.password"
                        :prefix-icon="Lock"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(formRef)" style="width: 100%;">登 录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Avatar, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import request from '../utils/request';
import router from '../router';

const formSize = ref('')
const formRef = ref()
const form = reactive({
    account: '',
    password: ''
})

const rules = reactive({
    account: [
        {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
        },
        {
            min: 3,
            max: 15,
            message: '账号长度应大于 3 小于 15',
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        },
        {
            min: 3,
            max: 15,
            message: '密码长度应大于 3 小于 15',
            trigger: 'blur',
        },
    ],
})

const onSubmit = (formEl) => {
    console.log(formEl)
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            request.post('/manager/login', form).then(res => {
                console.log(res)
                if (res.code === '0') {
                    sessionStorage.setItem('token', JSON.stringify(res.data))
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                    })
                    router.push('/')
                } else {
                    ElMessage.error(res.msg)
                }
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
</script>

<style scoped>
.container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #d9ecff;
}
.login {
    border: 1px solid #4aa4ff;
    padding: 1rem;
    border-radius: .5rem;
    background-color: #fff;
}
.title {
    text-align: center;
    color: #4aa4ff;
    height: 3rem;
    line-height: 3rem;
}
</style>