<template>
  <div class="user-stats">
    <div v-if="!isLoggedIn" class="auth-prompt">
      <RouterLink to="/login">Log In</RouterLink> to see your stats
    </div>
    <div v-else>
      <h2>{{ username }}</h2>
      
      <div class="stats-grid">
        <div class="stat">
          <div class="stat-number">{{ postCount }}</div>
          <div class="stat-label">Posts</div>
        </div>
        
        <div class="stat">
          <div class="stat-number">{{ followingCount }}</div>
          <div class="stat-label">Following</div>
        </div>
        
        <div class="stat">
          <div class="stat-number">{{ followersCount }}</div>
          <div class="stat-label">Followers</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const props = defineProps({
  isLoggedIn: {
    type: Boolean,            
    required: true            
  },
  username: {
    type: String,             
    default: ''               
  },
  postCount: {
    type: Number,             
    default: 0                
  },
  followingCount: {
    type: Number,             
    default: 0                
  },
  followersCount: {
    type: Number,             
    default: 0              
  }
});
</script>

<style scoped>
.user-stats {
  background: white;
  border-radius: 8px;         
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
}

.auth-prompt {
  text-align: center;
  padding: 10px;
}

.auth-prompt a {
  color: #42b983;            
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 10px;                
  text-align: center;       
}

.stat-number {
  font-size: 1.5rem;         
  font-weight: bold;         
  color: #2c3e50;           
}

.stat-label {
  font-size: 0.9rem;         
  color: #7f8c8d;          
}
</style>