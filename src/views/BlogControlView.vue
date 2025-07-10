<template>
  <div style="overflow-x: auto; white-space: nowrap;">
    <v-breadcrumbs :items="items" class="mb-5">
      <template v-slot:prepend>
        <v-icon size="small"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>
  <div class="mt-10 mb-5">
    <v-form ref="form" @submit.prevent="submit">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="blogName" label="название блога" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="fullName" label="имя автора блога" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-btn class="w-100" color="primary" style="height: 56px;" type="submit">создать блог</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
  <div v-if="!blogStore.isLoading" >
    <v-row>
      <v-col cols="12" v-for="blog of blogStore.reversedBlogs" :key="blog.id">
        <Blog :blog-data="blog" />
      </v-col>
    </v-row>
  </div>
  <div v-else class="d-flex justify-center mt-5">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<script setup>
import Blog from '@/components/Blog.vue';
import { useBlogStore } from '@/stores/BlogStore';
import { onMounted, ref } from 'vue';
const blogStore = useBlogStore()

const blogName = ref('')
const fullName = ref('')
const form = ref('')

const items = [
  {
    title: 'управление блогами',
    disabled: true,
    to: '',
  },
]

onMounted(async () => {
  await blogStore.getAllBlogs()
})

async function submit() {
  await blogStore.createBlog(blogName.value, fullName.value)
  await blogStore.getAllBlogs()
}
</script>

<style lang="scss" scoped></style>
