<template>
  <div class="posts-section">
    <h3>{{ title }}</h3>
    
    <!-- Lists of posts shown if there are posts -->
    <div v-if="displayedPosts.length > 0">
      <!-- Loop through posts and display each one -->
      <PostItem 
        v-for="post in displayedPosts" 
        :key="post.timestamp"           
        :post="post" 
      />
    </div>

    <div v-else class="empty-feed">
      No posts to display yet.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import PostItem from './PostItem.vue';

const props = defineProps({
  posts: {
    type: Array,              
    required: true           
  },
  title: {
    type: String,             
    default: 'Posts'         
  },
  limit: {
    type: Number,             // Maximum number of posts to show
    default: 10              
  }
});


/** Limits number of displayeyd posts
 */
const displayedPosts = computed(() => {
  return props.posts.slice(0, props.limit);
});
</script>

<style scoped>

.posts-section {
  background-color: white;
  border-radius: 8px;        
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
}

.empty-feed {
  padding: 20px;
  text-align: center;
  color: #7f8c8d;            
  font-style: italic;        
}

h3 {
  margin-top: 0;             
  margin-bottom: 15px;       
  color: #2c3e50;           
}
</style>