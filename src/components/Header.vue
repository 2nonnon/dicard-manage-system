<template>
    <div class="container">
        <div class="title">后台管理系统</div>
        <div class="admin">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    {{ name }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleQuit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import router from '../router';
import { ref, onMounted } from 'vue';
const name = ref('')
onMounted(() => {
    name.value = JSON.parse(sessionStorage.getItem('token')).name
})

const handleQuit = () => {
    sessionStorage.removeItem('token')
    router.push('/login')
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.container {
    display: flex;
    padding: .5rem 2rem;
    border-bottom: 1px solid #DCDFE6;
}
.title {
    flex: 1;
    color: #409EFF;
    font-weight: bold;
}
.admin {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>