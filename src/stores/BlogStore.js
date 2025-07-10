import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useBlogStore = defineStore('blog', () => {
  const blog = ref({})
  const blogsData = ref([])
  const isLoading = ref(true)
  const isLoadingPosts = ref(true)
  const blogPosts = ref([])

  async function getBlogById(id) {
    try {
      isLoading.value = true
      const blogs = await (await axios.get('/FrontTestingService-back/userInfo/findAll')).data
      blog.value = blogs.find(blog => blog.id === +id)
      blogPosts.value = blog.value.post
      isLoading.value = false
    } catch (e) {
      console.log(e)
    }
  }

  async function getAllBlogs() {
    try {
      isLoading.value = true
      const blogs = await axios.get('/FrontTestingService-back/userInfo/findAll')
      blogsData.value = await blogs.data
      isLoading.value = false
    } catch (e) {
      console.log(e)
    }
  }

  async function getBlogPostsById(id) {
    try {
      isLoadingPosts.value = true
      const blogs = await (await axios.get('/FrontTestingService-back/userInfo/findAll')).data
      blogPosts.value = blogs.find(blog => blog.id === +id).post
      isLoadingPosts.value = false
    } catch (e) {
      console.log(e)
    }
  }

  async function createBlog(blogName, fullName) {
    try {
      await axios.post('/FrontTestingService-back/userInfo', {
        blogName,
        fullName
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function deleteBlog(id) {
    try {
      await axios.delete(`/FrontTestingService-back/userInfo/${id}`)
    } catch (e) {
      console.log(e)
    }
  }

  const sortedBlog = computed(() => {
    return [...blogPosts.value].sort((a, b) => {
      const diff = new Date(b.dateTime) - new Date(a.dateTime)
      return diff !== 0 ? diff : -1
    });
  })

  const reversedBlogs = computed(() => {
    return [...blogsData.value].reverse()
  });


  return { blog, blogsData, blogPosts, isLoading, isLoadingPosts, getBlogById, getBlogPostsById, getAllBlogs, createBlog, deleteBlog, sortedBlog, reversedBlogs }
})
