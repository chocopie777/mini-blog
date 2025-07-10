<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue';
const drawer = ref(true)
</script>

<template>
  <v-app>
    <v-navigation-drawer color="primary" height="25" v-model="drawer">
      <router-link to="/" custom v-slot="{ navigate }">
        <v-list-item link title="Home" @click="(e) => navigate()"></v-list-item>
      </router-link>
      <v-divider></v-divider>
      <router-link to="/blog-control" custom v-slot="{ navigate }">
        <v-list-item link title="Управление блогами" @click="(e) => navigate()"></v-list-item>
      </router-link>
      <v-divider></v-divider>
    </v-navigation-drawer>
    <v-app-bar :elevation="2" color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-container>
        <RouterLink to="/" style="text-decoration: none; color: #fff;">
          <v-app-bar-title>Mini Blog</v-app-bar-title>
        </RouterLink>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container max-width="1200px">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
