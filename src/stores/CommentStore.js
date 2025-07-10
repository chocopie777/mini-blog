import { defineStore } from 'pinia'
import axios from 'axios'
import { computed, ref } from 'vue'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref([])
  const isLoading = ref(true)

  async function getComments(id) {
    try {
      isLoading.value = true
      comments.value = await (await axios.get(`/FrontTestingService-back/post/${id}`)).data.comments
      isLoading.value = false
    } catch (e) {
      console.log(e);
    }
  }

  async function addComment(name, email, comment, postId) {
    try {
      isLoading.value = true
      await axios.post(`/FrontTestingService-back/comment?postId=${postId}`, {
        email: email,
        textComment: comment,
        userInfo: name
      })
      isLoading.value = false
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteComment(commentId) {
    try {
      isLoading.value = true
      await axios.delete(`/FrontTestingService-back/comment/${commentId}`)
      isLoading.value = false
    } catch (e) {
      console.log(e);
    }
  }

  const sortedComments = computed(() => {
    return comments?.value?.sort((a, b) => {
      const diff = new Date(b.dateTime) - new Date(a.dateTime)
      return diff !== 0 ? diff : -1
    });
  })

  return { comments, sortedComments, isLoading, addComment, deleteComment, getComments }
})
