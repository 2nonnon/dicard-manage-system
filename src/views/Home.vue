<template>
  <layout>
    <template #head>
      <Header></Header>
    </template>
    <template #aside>
      <Asider></Asider>
    </template>
    <template #main>
      <router-view></router-view>
    </template>
  </layout>
</template>

<script setup>
// @ is an alias to /src
import Layout from '../layout/Layout.vue';
import Header from '../components/Header.vue';
import Asider from '../components/Asider.vue';
</script>
