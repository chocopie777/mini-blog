import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import PostView from '@/views/PostView.vue'
import PostEditView from '@/views/PostEditView.vue'
import BlogControlView from '@/views/BlogControlView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/blog/:id',
      name: 'blog',
      component: BlogView,
    },
    {
      path: '/blog-control/blog/:blogId',
      name: 'blog-control-blog',
      component: BlogView,
      meta: {
        parent: 'blog-control'
      }
    },
    {
      path: '/blog-control/blog/:blogId/post/:id',
      name: 'blog-control-blog-post',
      component: PostView,
      meta: {
        parent: 'blog-control'
      }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostView,
    },
    {
      path: '/blog/:blogId/post-edit/:id',
      name: 'post-edit',
      component: PostEditView,
    },
    {
      path: '/blog-control/blog/:blogId/post-edit/:id',
      name: 'blog-control-post-edit',
      component: PostEditView,
      meta: {
        parent: 'blog-control'
      }
    },
    {
      path: '/blog/:blogId/post/:id',
      name: 'blog-post',
      component: PostView,
      meta: {
        parent: 'blog'
      }
    },
    {
      path: '/blog-control',
      name: 'blog-control',
      component: BlogControlView,
    },
  ],
})

export default router
