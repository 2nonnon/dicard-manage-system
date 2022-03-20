<template>
    <el-menu class="el-menu" :default-active="menuIndex" router>
        <el-sub-menu index="1">
            <template #title>
                <el-icon>
                    <icon-menu />
                </el-icon>
                <span>系统管理</span>
            </template>
            <el-menu-item index="userManage">用户管理</el-menu-item>
            <el-menu-item index="orderManage">订单管理</el-menu-item>
            <el-menu-item index="goodsManage">商品管理</el-menu-item>
            <el-menu-item index="categoryManage">分类管理</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script setup>
import {
    Menu as IconMenu
} from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuIndex = computed(() => {
    return route.path.slice(1)
})
</script>

<style scoped>
.el-menu {
    width: 200px;
    height: 100%;
}
</style>