<template>
  <div v-if="!blogStore.isLoading">
    <div v-if="items.length > 0" style="overflow-x: auto; white-space: nowrap;">
      <v-breadcrumbs :items="items" class="mb-5">
        <template v-slot:prepend>
          <v-icon size="small"></v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div v-else class="d-flex justify-center mt-5">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div class="d-flex flex-column flex-md-row align-start justify-space-between">
      <div class="text-h2 mb-2" style="word-break: break-all;">
        {{ blogStore.blog.blogName }}
      </div>
      <v-btn class="order-first order-md-last" color="error" style="height: 56px;" type="submit" @click="async () => {
        await blogStore.deleteBlog(blogStore.blog.id)
        $router.push(`/`)
      }">Удалить блог</v-btn>
    </div>
    <div class="text-h6 text-medium-emphasis mb-5">Автор: {{ blogStore.blog.fullName }}</div>
    <div class="mt-10 mb-5">
      <v-form ref="form" @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field v-model="title" :rules="titleRules" :counter="50" label="заголовок поста"
                required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="briefDescription" :rules="briefDescriptionRules" :counter="100"
                label="краткое описание" required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="fullDescription" :rules="fullDescriptionRules" :counter="255"
                label="полное описание" required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-btn class="w-100" color="primary" style="height: 56px;" type="submit">создать</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <hr>
    <div v-if="blogStore.sortedBlog.length > 0">
      <v-row v-if="!blogStore.isLoadingPosts" class="mt-5">
        <v-col cols="12" md="6" v-for="post of blogStore.sortedBlog" :key="post.id">
          <PostInBlog :post-data="post" :full-name="blogStore.blog.fullName" :blog-id="blogStore.blog.id" />
        </v-col>
      </v-row>
      <div v-else class="d-flex justify-center mt-5">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </div>
    <div v-else class="text-center font-italic text-medium-emphasis mt-10">
      В этом блоге нет постов...
    </div>
  </div>
  <div v-else class="d-flex justify-center mt-5">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<script setup>
import PostInBlog from '@/components/PostInBlog.vue';
import { useBlogStore } from '@/stores/BlogStore';
import { usePostStore } from '@/stores/PostStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const blogStore = useBlogStore()
const postStore = usePostStore()
const route = useRoute()

const briefDescription = ref('')
const fullDescription = ref('')
const title = ref('')
const items = ref([])
const form = ref()

//валидация briefDescription
const briefDescriptionRules = [
  value => {
    if (value) return true

    return 'briefDescription is required.'
  },
  value => {
    if (value.length <= 100) return true

    return 'briefDescription must be less than 100 characters'
  },
]
//валидация fullDescription
const fullDescriptionRules = [
  value => {
    if (value?.length <= 255) return true

    return 'fullDescription must be less than 255 characters'
  },
]
//валидация title
const titleRules = [
  value => {
    if (value) return true

    return 'title is required.'
  },
  value => {
    if (value.length <= 50) return true

    return 'title must be less than 50 characters'
  },
]

onMounted(async () => {
  if (route.params.blogId) {
    await blogStore.getBlogById(route.params.blogId)
    items.value = [
      {
        title: 'Управление блогами',
        disabled: false,
        to: '/blog-control',
      },
      {
        title: `${blogStore.blog.blogName}`,
        disabled: true,
        to: '',
      },
    ]
    await blogStore.getBlogPostsById(route.params.blogId)
  } else {
    await blogStore.getBlogById(route.params.id)
    blogStore.isLoading = false
    items.value = [
      {
        title: 'Home',
        disabled: false,
        to: '/',
      },
      {
        title: `${blogStore.blog.blogName}`,
        disabled: true,
        to: '',
      },
    ]
    await blogStore.getBlogPostsById(route.params.id)
  }
})

async function submit() {
  if ((briefDescription.value && (briefDescription.value.length > 0 && briefDescription.value.length <= 100)) &&
    (fullDescription.value.length <= 255) &&
    (title.value && (title.value.length > 0 && title.value.length <= 50))) {
    if (route.params.blogId) {
      await postStore.addPost(route.params.blogId, briefDescription.value, fullDescription.value, title.value)
      title.value = ''
      briefDescription.value = ''
      fullDescription.value = ''
      form.value.resetValidation()
      await blogStore.getBlogPostsById(route.params.blogId)
    } else {
      await postStore.addPost(route.params.id, briefDescription.value, fullDescription.value, title.value)
      title.value = ''
      briefDescription.value = ''
      fullDescription.value = ''
      form.value.resetValidation()
      await blogStore.getBlogPostsById(route.params.id)
    }
  }
}
</script>

<style lang="scss" scoped></style>
