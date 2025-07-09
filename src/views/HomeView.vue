<template>
  <div class="home-view">
    <!-- Logged Out View -->
    <template v-if="!isLoggedIn">
      <div class="header">
        <h1>Home Page</h1>
      </div>
      <div class="content-container">
        <div class="left-column">
          <div class="login-card">
            <button class="login-button" @click="navigateToLogin">Log In</button>
          </div>
        </div>
        <div class="middle-column">
          <PostFeed 
            :posts="publicPosts" 
            title="Recent Posts"
          />
        </div>
        <div class="right-column">
          <SuggestedFollowers :users="suggestedUsers"/>
        </div>
      </div>
    </template>

    <!-- Logged In View -->
    <template v-else>
      <div class="header">
        <h1>Welcome, {{ currentUsername }}!</h1>
      </div>
      <div class="content-container">
        <div class="left-column">
          <UserStats
            :isLoggedIn="isLoggedIn"
            :username="currentUsername"
            :postCount="userPosts.length"
            :followingCount="following.length"
            :followersCount="followers.length"
          />
        </div>
        <div class="middle-column">
          <!-- Post Input Section -->
          <div class="create-post">
            <h3>Create a new Post</h3>
            <textarea v-model="newPostContent" placeholder="Whats Happening?"></textarea>
            <button @click="createPost" class="post-button">Post</button>
          </div>
          <PostFeed 
            :posts="userPosts" 
            title="Your Feed"
          />
        </div>
        <div class="right-column">
          <SuggestedFollowers
            :users="suggestedUsers"
            :isLoggedIn="isLoggedIn"
            :following="following"
            @follow="handleFollow"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserStats from '@/components/UserStats.vue';
import PostFeed from '@/components/PostFeed.vue';
import SuggestedFollowers from '@/components/SuggestedFollowers.vue';

const router = useRouter();

// Auth state
const isLoggedIn = ref(false);
const currentUser = ref('');
const currentUsername = computed(() => currentUser.value.split('@')[0] || 'User');

// Post data
const newPostContent = ref('');
const publicPosts = ref([
  { id: 1, author: 'Jefren', content: "Fourth post!", timestamp: Date.now() },
  { id: 2, author: 'Jefren', content: "First post!", timestamp: Date.now() - 100000 }
]);

const userPosts = ref([
  { id: 3, author: currentUsername.value, content: "First post!", timestamp: Date.now() },
  { id: 4, author: currentUsername.value, content: "More posts", timestamp: Date.now() - 50000 }
]);

// Following data
const following = ref(['1']);
const followers = ref([]);
const suggestedUsers = ref([
  { id: '1', username: 'jefren' },
  { id: '2', username: 'howard' },
  { id: '3', username: 'teacher' }
]);

// Check auth status
onMounted(() => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    isLoggedIn.value = true;
    currentUser.value = savedUser;
  }
});

// Create post
const createPost = () => {
  if (newPostContent.value.trim()) {
    userPosts.value.unshift({
      id: Date.now(),
      author: currentUsername.value,
      content: newPostContent.value,
      timestamp: Date.now()
    });
    newPostContent.value = '';
  }
};

// Navigation
const navigateToLogin = () => {
  router.push('/login');
};

// Follow user
const handleFollow = (userId) => {
  if (!following.value.includes(userId)) {
    following.value.push(userId);
  }
};
</script>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 80px;
  background-color: white;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.content-container {
  display: flex;
  gap: 20px;
}

.left-column {
  flex: 1;
  min-width: 250px;
}

.middle-column {
  flex: 2;
  min-width: 500px;
}

.right-column {
  flex: 1;
  min-width: 250px;
}

.create-post {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.create-post textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.post-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 80px; 
  background-color: white;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.content-container {
  display: flex;
  gap: 20px;
}

.left-column {
  flex: 1;
  min-width: 250px;
}

.middle-column {
  flex: 2;
  min-width: 500px;
}

.right-column {
  flex: 1;
  min-width: 250px;
}


.login-card, .profile-card, .posts-section, .who-to-follow, .create-post {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 100px;
}

.login-button, .post-button, .follow-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.post {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.post-author {
  font-weight: bold;
  color: #2c3e50;
}

.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
</style>