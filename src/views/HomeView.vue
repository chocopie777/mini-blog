<script setup>
import Post from '@/components/Post.vue';
import { usePostStore } from '@/stores/PostStore';
import axios from 'axios';
import { onMounted } from 'vue';
const postStore = usePostStore()

const items = [
  {
    title: 'Home',
    disabled: true,
    to: '',
  },
]

postStore.isLoading = true

onMounted(async () => {
  await axios.post(`/FrontTestingService-auth/login?username=${import.meta.env.VITE_LOGIN}&password=${import.meta.env.VITE_PASSWORD}`)
  await postStore.getAllPosts()
})
</script>

<template>
  <div style="overflow-x: auto; white-space: nowrap;">
    <v-breadcrumbs :items="items" class="mb-5">
      <template v-slot:prepend>
        <v-icon size="small"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>
  <v-row v-if="!postStore.isLoading">
    <v-col cols="12" md="6" v-for="post of postStore.sortedPosts" :key="post.id">
      <Post :post-data="post" />
    </v-col>
  </v-row>
  <div v-else class="d-flex justify-center mt-5">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<style scoped></style>
