<template>
  <v-card>
    <div class="d-flex flex-column">
      <v-card-title class="clickable-title" style="text-decoration: underline;"
        @click="$router.push(`/post/${postData.id}`)">
        {{ postData.title }}
      </v-card-title>
      <v-card-subtitle class="clickable-title" style="text-decoration: underline;"
        @click="$router.push(`/blog/${postData.blogId}`)">
        {{ postData.fullName }}
      </v-card-subtitle>
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
const {postData} = defineProps({
  postData: Object,
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
