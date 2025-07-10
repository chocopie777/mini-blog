<template>
  <div v-if="!postStore.isLoading && !blogStore.isLoading">
    <div style="overflow-x: auto; white-space: nowrap;">
      <v-breadcrumbs :items="items" class="mb-5">
        <template v-slot:prepend>
          <v-icon size="small"></v-icon>
        </template>
      </v-breadcrumbs>
    </div>
    <div class="text-h4 mb-1 font-weight-bold">
      {{ postStore.post.title }}
    </div>
    <div class="text-body-2 text-medium-emphasis mb-10">
      {{ postStore.post.dateTime }}
    </div>
    <div class="mb-5">
      {{ postStore.post.briefDescription }}
    </div>
    <div class="mb-10">
      {{ postStore.post.fullDescription }}
    </div>
    <hr class="mb-3">
    <span class="text-h5 font-weight-bold mb-3 d-block">Комментарии ({{ commentStore.comments.length }})</span>
    <div>
      <v-form ref="form" @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field v-model="formName" :rules="nameRules" :counter="50" label="имя" required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="formEmail" :rules="emailRules" :counter="50" label="email" required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="formComment" :rules="commentRules" :counter="255" label="комментарий"
                required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-btn class="w-100" color="primary" style="height: 56px;" type="submit">отправить</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </div>
    <div v-if="!commentStore.isLoading">
      <div v-if="commentStore.comments.length > 0">
        <v-card v-for="comment of commentStore.sortedComments" :key="comment.id" class="mb-5">
          <v-card-item>
            <div class="d-flex">
              <div class="d-flex flex-column mr-5">
                <span class="mb-3 font">
                  <span class="font-weight-bold">
                    {{ comment.userInfo }}
                  </span>
                  <span>
                    ({{ comment.email }})
                  </span>
                </span>
                <span class="text-medium-emphasis">
                  {{ comment.dateTime }}
                </span>
              </div>
              <div class="font-italic text-capitalize text-h6">
                {{ comment.textComment }}
              </div>
              <div class="ml-auto">
                <v-btn density="compact" rounded="circle" size="25" @click="async () => {
                  await commentStore.deleteComment(comment.id)
                  await commentStore.getComments(route.params.id)
                }">
                  <v-icon icon="mdi-delete" color="red" size="24"></v-icon>
                </v-btn>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </div>
      <div v-else class="text-center font-italic text-medium-emphasis">Комментариев пока нет...</div>
    </div>
    <div v-else class="d-flex justify-center mt-5">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </div>
  <div v-else class="d-flex justify-center mt-5">
    <v-progress-circular indeterminate></v-progress-circular>
  </div>
</template>

<script setup>
import { useBlogStore } from '@/stores/BlogStore';
import { useCommentStore } from '@/stores/CommentStore';
import { usePostStore } from '@/stores/PostStore';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const formName = ref('')
const formEmail = ref('')
const formComment = ref('')
const items = ref([])
const form = ref()

const route = useRoute()
const postStore = usePostStore()
const commentStore = useCommentStore()
const blogStore = useBlogStore()

//валидация email
const emailRules = [
  value => {
    if (value) return true

    return 'E-mail is required.'
  },
  value => {
    if (/.+@.+\..+/.test(value)) return true

    return 'E-mail must be valid.'
  },
  value => {
    if (value.length <= 50) return true

    return 'email must be less than 50 characters'
  },
]
//валидация name
const nameRules = [
  value => {
    if (value) return true

    return 'name is required.'
  },
  value => {
    if (value.length <= 50) return true

    return 'name must be less than 50 characters'
  },
]
//валидация comment
const commentRules = [
  value => {
    if (value) return true

    return 'comment is required.'
  },
  value => {
    if (value.length <= 255) return true

    return 'comment must be less than 255 characters'
  },
]

async function submit() {
  if ((formEmail.value && (/.+@.+\..+/.test(formEmail.value)) && (formEmail.value.length > 0 && formEmail.value.length <= 55)) &&
    (formName.value && (formName.value.length > 0 && formName.value.length <= 50)) &&
    (formComment.value && (formComment.value.length > 0 && formComment.value.length <= 255))) {
    await commentStore.addComment(formName.value, formEmail.value, formComment.value, postStore.post.id)
    form.value.reset()
    await commentStore.getComments(route.params.id)
  }
}


onMounted(async () => {
  await postStore.getPostById(route.params.id)
  switch (route.meta.parent) {
    case 'blog':
      await blogStore.getBlogById(route.params.blogId)
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
      break
    case 'blog-control':
      await blogStore.getBlogById(route.params.blogId)
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
      break
    default:
      blogStore.isLoading = false
      items.value = [
        {
          title: 'Home',
          disabled: false,
          to: '/',
        },
        {
          title: `${postStore.post.title}`,
          disabled: true,
          to: '',
        },
      ]
  }
  await commentStore.getComments(route.params.id)
})
</script>

<style lang="scss" scoped></style>
