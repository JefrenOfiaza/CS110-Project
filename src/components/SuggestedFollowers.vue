<template>
  <div class="who-to-follow">
    <h3>{{ title }}</h3>
    
    <!-- Suggesition lits only shown if users exist -->
    <div v-if="users.length > 0">
      <!-- Loop through each suggested user -->
      <div v-for="user in users" :key="user.id" class="user-suggestion">
        
        <!-- User profile link -->
        <RouterLink :to="`/users/${user.id}`" class="user-link">
          @{{ user.username }}
        </RouterLink>
        
        <!-- Shows if user is logged in, not already following, and not on profile view -->
        <button 
          v-if="isLoggedIn && !isFollowing(user.id) && !isProfileView" 
          @click="followUser(user.id)"
          class="follow-button"
        >
          Follow
        </button>
        
        <span v-else-if="isLoggedIn && isFollowing(user.id)" class="following-text">
          Following
        </span>
      </div>
    </div>
    
    <div v-else class="no-suggestions">
      <p>{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';


const props = defineProps({
  users: {
    type: Array,              
    required: true            
  },
  isLoggedIn: {
    type: Boolean,            
    default: false            
  },
  following: {
    type: Array,              
    default: () => []         // empty array default
  },
  isProfileView: {
    type: Boolean,            
    default: false            
  },
  title: {
    type: String,             
    default: 'Who to Follow'  
  },
  emptyMessage: {
    type: String,             
    default: 'No suggestions available'  
  }
});

const emit = defineEmits(['follow']);

const isFollowing = (userId) => {
 return props.following.includes(userId);
};

const followUser = (userId) => {
 emit('follow', userId);
};
</script>

<style scoped>
.who-to-follow {
  background-color: white;
  border-radius: 8px;         
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
}

h3 {
  margin-top: 0;       
  margin-bottom: 15px;       
  color: #2c3e50;
}

.user-suggestion {
  display: flex;             
  justify-content: space-between;  
  align-items: center;       
  padding: 10px 0;          
  border-bottom: 1px solid #eee;  
}

.user-suggestion:last-child {
  border-bottom: none;
}

.user-link {
  color: #42b983;           
  text-decoration: none;     
}

.user-link:hover {
  text-decoration: underline;
}

.follow-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 5px 10px;         
  border-radius: 4px;
  font-size: 0.9em;          
  cursor: pointer;
}

.follow-button:hover {
  background-color: #3aa876;  
}

.following-text {
  color: #7f8c8d;          
  font-size: 0.9em;         
}

.no-suggestions {
  color: #7f8c8d;           
  font-style: italic;        
  padding: 10px 0;
  text-align: center;
}
</style>