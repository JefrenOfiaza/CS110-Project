<template>
  <div class="profile-view">
    <div class="header">
      <h1>User Profile</h1>
    </div>
    
    <!-- Loading state that shows while fetching user data -->
    <div v-if="loading" class="loading">
      Loading user profile...
    </div>
    
    <!-- Profile content shown when user data is loaded -->
    <div v-else-if="profileUser" class="content-container">
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
          :title="`${profileUser.username}'s Posts`"
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
          @follow="handleFollow"                    
        />
      </div>
    </div>
    
    <div v-else class="error">
      User not found.
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, firestore } from '@/firebaseResources';
import UserStats from '@/components/UserStats.vue';
import PostFeed from '@/components/PostFeed.vue';
import SuggestedFollowers from '@/components/SuggestedFollowers.vue';

const route = useRoute();

const profileUser = ref(null);      
const profilePosts = ref([]);       
const loading = ref(true);          
const isLoggedIn = ref(false);
const currentUser = ref(null);
const currentUserFollowing = ref([]); 

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true;
      currentUser.value = user;
      await loadCurrentUserData();
    } else {
      isLoggedIn.value = false;
      currentUser.value = null;
    }
  });
  
  await loadProfileData();
});

/**
 * Load current user's data (the viewer, not the profile user)
 * Gets the list of users they're following
 */
const loadCurrentUserData = async () => {
  if (!currentUser.value) return;
  
  try {
    const userDocRef = doc(firestore, 'users', currentUser.value.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Update following list for follow button logic
      currentUserFollowing.value = userData.following || [];
    }
  } catch (error) {
    console.error('Error loading current user data:', error);
  }
};

/**
 * Load profile user's data and posts
 * Gets the user whose profile is being viewefd
 */
const loadProfileData = async () => {
  const userId = route.params.id;
  
  try {
    loading.value = true;
    
    // Get user document from Firestore
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Set up profile user object
      profileUser.value = {
        id: userId,
        username: userData.email?.split('@')[0] || 'User',  // Extract username from email
        email: userData.email,
        followingCount: userData.following?.length || 0,
        followersCount: userData.followers?.length || 0
      };
      
      // Load this user's posts
      await loadUserPosts(userData.posts || []);
    } else {
      // User document doesn't exist
      profileUser.value = null;
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
    profileUser.value = null;
  } finally {
    loading.value = false;
  }
};

const loadUserPosts = async (postIds) => {
  try {
    const posts = [];
    // Get each post document
    for (const postId of postIds) {
      const postDoc = await getDoc(doc(firestore, 'posts', postId));
      if (postDoc.exists()) {
        posts.push({
          id: postDoc.id,
          ...postDoc.data()
        });
      }
    }
    
    // Sort posts by timestamp 
    profilePosts.value = posts.sort((a, b) => {
      // Handle different timestamp formats
      const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp).getTime();
      const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error loading user posts:', error);
  }
};

const handleFollow = async (userId) => {
  // Don't follow if not logged in or already following
  if (!currentUser.value || currentUserFollowing.value.includes(userId)) return;
  
  try {
    const currentUserDocRef = doc(firestore, 'users', currentUser.value.uid);
    const targetUserDocRef = doc(firestore, 'users', userId);
    
    // Add target user to current user's following list
    await updateDoc(currentUserDocRef, {
      following: arrayUnion(userId)
    });
    
    // Add curretnt user to target user's followers lits
    await updateDoc(targetUserDocRef, {
      followers: arrayUnion(currentUser.value.uid)
    });
    
    // Add target user's posts to curent user's feed
    const targetUserDoc = await getDoc(targetUserDocRef);
    if (targetUserDoc.exists()) {
      const targetUserData = targetUserDoc.data();
      const targetUserPosts = targetUserData.posts || [];
      
      // Only update feed fif target user has posts
      if (targetUserPosts.length > 0) {
        await updateDoc(currentUserDocRef, {
          feed: arrayUnion(...targetUserPosts)
        });
      }
    }
    
    // Update local state 
    currentUserFollowing.value.push(userId);
    
    // Refresh profile data to update follower count
    await loadProfileData();
    
  } catch (error) {
    console.error('Error following user:', error);
  }
};
</script>

<style scoped>
.profile-view {
  max-width: 1400px;          
  margin: 0 auto;             
  padding: 20px;
  padding-top: 80px;        
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

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #7f8c8d;           
}

.error {
  color: #e74c3c;          
}
</style>