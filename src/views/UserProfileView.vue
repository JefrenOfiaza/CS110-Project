<!-- src/views/UserProfileView.vue -->
<template>
  <div class="profile-view">
    <div class="header">
      <h1>User Profile</h1>
    </div>
    
    <div class="content-container">
      <div class="left-column">
        <UserStats
          :isLoggedIn="true"
          :username="profileUser.username"
          :postCount="profilePosts.length"
          :followingCount="profileUser.followingCount"
          :followersCount="profileUser.followersCount"
        />
      </div>
      
      <div class="middle-column">
        <PostFeed 
          :posts="profilePosts" 
          title="User Posts"
        />
      </div>
      
      <div class="right-column">
        <SuggestedFollowers
          :users="[profileUser]"
          :isLoggedIn="isLoggedIn"
          :following="currentUserFollowing"
          :isProfileView="true"
          title="Follow this User"
          emptyMessage="No user data"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import UserStats from '@/components/UserStats.vue';
import PostFeed from '@/components/PostFeed.vue';
import SuggestedFollowers from '@/components/SuggestedFollowers.vue';

const route = useRoute();

// Mock data 
const profileUser = ref({
  id: route.params.id,
  username: 'example_user',
  followingCount: 42,
  followersCount: 123
});

const profilePosts = ref([
  { id: 1, author: profileUser.value.username, content: "First post!", timestamp: Date.now() },
  { id: 2, author: profileUser.value.username, content: "Another post", timestamp: Date.now() - 100000 }
]);


const isLoggedIn = ref(true);
const currentUserFollowing = ref(['user1', 'user2']);
</script>

<style scoped>
.profile-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 80px;
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
</style>