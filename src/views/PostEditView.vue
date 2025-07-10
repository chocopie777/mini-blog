<template>
  <div>
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
    <div class="mt-10 mb-5">
      <v-form ref="form" @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="title" :rules="titleRules" :counter="50" label="заголовок поста"
                required></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="briefDescription" :rules="briefDescriptionRules" :counter="100"
                label="краткое описание" required></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field v-model="fullDescription" :rules="fullDescriptionRules" :counter="255"
                label="полное описание" required></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-btn class="w-100" color="primary" style="height: 56px;" type="submit">сохранить</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-snackbar v-model="snackbar" color="success">
        Пост изменен успешно!

        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="snackbarError" color="error">
        Произошла ошибка по время изменения поста!

        <template v-slot:actions>
          <v-btn variant="text" @click="snackbarError = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script setup>
import { useBlogStore } from '@/stores/BlogStore'
import { usePostStore } from '@/stores/PostStore'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const blogStore = useBlogStore()
const postStore = usePostStore()
const route = useRoute()
const items = ref([])
const briefDescription = ref('')
const fullDescription = ref('')
const title = ref('')
const form = ref()
const snackbar = ref(false)
const snackbarError = ref(false)

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
    if (value.length <= 255) return true

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
  await blogStore.getBlogById(route.params.blogId)
  await postStore.getPostById(route.params.id)
  briefDescription.value = postStore.post.briefDescription
  fullDescription.value = postStore.post.fullDescription
  title.value = postStore.post.title
  if (route.meta.parent === 'blog-control') {
    items.value = [
      {
        title: 'Управление блогами',
        disabled: false,
        to: '/blog-control',
      },
      {
        title: `${blogStore.blog.blogName}`,
        disabled: false,
        to: `/blog-control/blog/${route.params.blogId}`,
      },
      {
        title: `${postStore.post.title}`,
        disabled: true,
        to: '',
      },
    ]
  } else {
    items.value = [
      {
        title: 'Home',
        disabled: false,
        to: '/',
      },
      {
        title: `${blogStore.blog.blogName}`,
        disabled: false,
        to: `/blog/${route.params.blogId}`,
      },
      {
        title: `${postStore.post.title}`,
        disabled: true,
        to: '',
      },
    ]
  }
})

async function submit() {
  if ((briefDescription.value && (briefDescription.value.length > 0 && briefDescription.value.length <= 100)) &&
    (fullDescription.value.length <= 255) &&
    (title.value && (title.value.length > 0 && title.value.length <= 50))) {
    const result = await postStore.editPost(route.params.id, briefDescription.value, fullDescription.value, title.value)
    if (result === 200) {
      await postStore.getPostById(route.params.id)
      items.value = [
        {
          title: 'Home',
          disabled: false,
          to: '/',
        },
        {
          title: `${blogStore.blog.blogName}`,
          disabled: false,
          to: `/blog/${route.params.blogId}`,
        },
        {
          title: `${postStore.post.title}`,
          disabled: true,
          to: '',
        },
      ]
      snackbarError.value = false
      snackbar.value = true
    } else {
      snackbar.value = false
      snackbarError.value = true
    }
  } else {
    snackbar.value = false
    snackbarError.value = true
  }
}
</script>

<style lang="scss" scoped></style>
