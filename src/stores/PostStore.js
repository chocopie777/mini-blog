import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const post = ref({})
  const isLoading = ref(true)

  async function getAllPosts() {
    try {
      isLoading.value = true
      const users = await (await axios.get('/FrontTestingService-back/userInfo/findAll')).data
      const postsArray = []
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < users[i].post.length; j++) {
          postsArray.push({ ...users[i].post[j], fullName: users[i].fullName, blogId: users[i].id })
        }
      }
      postsArray.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      posts.value = postsArray
      isLoading.value = false
    } catch (e) {
      console.log(e)
    }
  }

  async function getPostById(id) {
    try {
      isLoading.value = true
      post.value = await (await axios.get(`/FrontTestingService-back/post/${id}`)).data
      isLoading.value = false
    } catch (e) {
      console.log(e);
    }
  }

  async function addPost(id, briefDescription, fullDescription, title) {
    try {
      await axios.post(`/FrontTestingService-back/post?userInfoId=${id}`, {
        briefDescription,
        fullDescription,
        title
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function deletePost(id) {
    try {
      await axios.delete(`/FrontTestingService-back/post/${id}`)
    } catch (e) {
      console.log(e)
    }
  }

  async function editPost(id, briefDescription, fullDescription, title) {
    try {
      const result = await axios.put(`/FrontTestingService-back/post`, {
        briefDescription,
        fullDescription,
        id,
        title
      })
      return result.status
    } catch (e) {
      console.log(e)
    }
  }

  const sortedPosts = computed(() => {
      return posts?.value?.sort((a, b) => {
        const diff = new Date(b.dateTime) - new Date(a.dateTime)
        return diff !== 0 ? diff : -1
      });
    })

  return { posts, post, isLoading, sortedPosts, getAllPosts, getPostById, addPost, deletePost, editPost }
})
