
<template>
  <div class="post">
    <div class="post-header">
      <span class="post-author">@{{ post.author }}</span>
      <span class="post-date">{{ formatDate(post.timestamp) }}</span>
    </div>
    <div class="post-content">{{ post.content }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
</script>

<style scoped>
.post {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.post:last-child {
  border-bottom: none;
}

.post-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.post-author {
  font-weight: bold;
  color: #2c3e50;
}

.post-date {
  color: #7f8c8d;
  font-size: 0.9em;
}

.post-content {
  color: #34495e;
  line-height: 1.4;
}
</style>