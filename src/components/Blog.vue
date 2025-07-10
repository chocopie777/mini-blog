<template>
  <v-card @click="$router.push(`/blog-control/blog/${blogData.id}`)">
    <div class="d-flex flex-column">
      <v-card-title>
        {{ blogData.blogName }}
      </v-card-title>
      <v-card-subtitle>
        {{ blogData.fullName }}
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script setup>
const {blogData} = defineProps({
  blogData: Object,
})
</script>

<style scoped>
</style>
