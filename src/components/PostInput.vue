
<template>
  <div class="post-input" v-if="isLoggedIn">
    <h3>Create a new Post</h3>
    <textarea 
      v-model="postContent" 
      placeholder="What's on your mind?"
      ref="textareaRef"
    ></textarea>
    <button @click="handlePost" class="post-button">Post</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['post']);

const postContent = ref('');
const textareaRef = ref(null);

const handlePost = () => {
  if (postContent.value.trim()) {
    emit('post', postContent.value);
    postContent.value = ''; // Clear the input
    textareaRef.value?.focus(); // Return focus to textarea
  }
};
</script>

<style scoped>
.post-input {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-input h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.post-input textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
}

.post-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.post-button:hover {
  background-color: #3aa876;
}
</style>