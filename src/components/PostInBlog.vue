<template>
  <v-card>
    <div class="d-flex justify-space-between">
      <div class="d-flex flex-column">
        <v-card-title class="clickable-title" style="text-decoration: underline;" @click="() => {
          if (route.meta.parent === 'blog-control') {
            $router.push(`/blog-control/blog/${blogId}/post/${postData.id}`)
          } else {
            $router.push(`/blog/${blogId}/post/${postData.id}`)
          }
        }">
          {{ postData.title }}
        </v-card-title>
        <v-card-subtitle class="clickable-title" style="text-decoration: underline;" @click="() => {
          if (route.meta.parent === 'blog-control') {
            $router.push(`/blog-control/blog/${blogId}/post/`)
          } else {
            $router.push(`/blog/${blogId}/post/${postData.id}`)
          }
        }">
          {{ fullName }}
        </v-card-subtitle>
      </div>
      <div class="mt-3 mr-3">
        <v-btn class="mr-3" density="compact" rounded="circle" size="25" @click="() => {
          if(route.meta.parent === 'blog-control') {
            $router.push(`/blog-control/blog/${blogId}/post-edit/${postData.id}`)
          } else {
            $router.push(`/blog/${blogId}/post-edit/${postData.id}`)
          }
        }">
          <v-icon icon="mdi-circle-edit-outline" color="blue" size="24"></v-icon>
        </v-btn>
        <v-btn density="compact" rounded="circle" size="25" @click="async () => {
          await postStore.deletePost(postData.id)
          await blogStore.getBlogPostsById(blogId)
        }">
          <v-icon icon="mdi-delete" color="red" size="24"></v-icon>
        </v-btn>
      </div>
    </div>
    <hr>
    <v-card-text>
      <div>{{ postData.briefDescription }}</div>
    </v-card-text>
    <hr>
    <v-card-actions class="d-block d-sm-flex justify-space-between">
      <v-card-subtitle>Комментариев: {{ postData.comments.length }}</v-card-subtitle>
      <v-card-subtitle>{{ postData.dateTime }}</v-card-subtitle>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useBlogStore } from '@/stores/BlogStore';
import { usePostStore } from '@/stores/PostStore';
import { useRoute } from 'vue-router';

const postStore = usePostStore()
const blogStore = useBlogStore()
const route = useRoute()

const { postData, fullName, blogId } = defineProps({
  postData: Object,
  fullName: String,
  blogId: Number,
})
</script>

<style scoped>
.clickable-title {
  cursor: pointer;
  font-weight: 600;
}

.clickable-title:hover {
  color: var(--v-primary-base);
}
</style>
