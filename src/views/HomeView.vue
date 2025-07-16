<template>
  <div class="home-view">
    <!-- Logged Out View-->
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

    <!-- ===== LOGGED IN VIEW ===== -->
    <template v-else>
      <div class="header">
        <h1>Welcome, {{ currentUsername }}!</h1>
      </div>
      <div class="content-container">
        <div class="left-column">
          <UserStats
            :isLoggedIn="isLoggedIn"
            :username="currentUsername"
            :postCount="userStats.postCount"
            :followingCount="userStats.followingCount"
            :followersCount="userStats.followersCount"
          />
        </div>
        <div class="middle-column">
          <div class="create-post">
            <h3>Create a new Post</h3>
            <textarea 
              v-model="newPostContent" 
              placeholder="What's happening?"
            ></textarea>
            <button 
              @click="createPost" 
              class="post-button"
              :disabled="!newPostContent.trim()"
            >
              Post
            </button>
          </div>
          <PostFeed 
            :posts="userFeed" 
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
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection,      // Reference to a collection
  addDoc,         // Add new document
  doc,            // Reference to a document
  updateDoc,      // Update existing document
  arrayUnion,     // Add items to array field
  getDoc,         // Get single document
  getDocs,        // Get multiple documents
  query,          // Create database query
  orderBy,        // Sort query results
  limit           // Limit number of results
} from 'firebase/firestore';
import { auth, firestore } from '@/firebaseResources';
import UserStats from '@/components/UserStats.vue';
import PostFeed from '@/components/PostFeed.vue';
import SuggestedFollowers from '@/components/SuggestedFollowers.vue';

const router = useRouter();

const isLoggedIn = ref(false);
const currentUser = ref(null);
// get username from email
const currentUsername = computed(() => 
  currentUser.value?.email?.split('@')[0] || 'User'
);

const newPostContent = ref('');    
const publicPosts = ref([]);       
const userFeed = ref([]);          

const userStats = ref({
  postCount: 0,
  followingCount: 0,
  followersCount: 0
});
const following = ref([]);         
const suggestedUsers = ref([]);   

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true;
      currentUser.value = user;
      await loadUserData();
      await loadUserFeed();
      await loadSuggestedUsers();
    } else {
      isLoggedIn.value = false;
      currentUser.value = null;
      await loadPublicPosts();
      await loadSuggestedUsers();
    }
  });
});

// Load current user data
const loadUserData = async () => {
  if (!currentUser.value) return;
  
  try {
    // Get user document from Firestore
    const userDocRef = doc(firestore, 'users', currentUser.value.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Update user statistics
      userStats.value = {
        postCount: userData.posts?.length || 0,
        followingCount: userData.following?.length || 0,
        followersCount: userData.followers?.length || 0
      };
      // Update following list
      following.value = userData.following || [];
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
};

const loadUserFeed = async () => {
  if (!currentUser.value) return;
  
  try {
    // Get user document to access their feed
    const userDocRef = doc(firestore, 'users', currentUser.value.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const feedPostIds = userData.feed || [];
      
      // Get the actual post documents from the feed
      const feedPosts = [];
      for (const postId of feedPostIds.slice(0, 10)) { 
        const postDoc = await getDoc(doc(firestore, 'posts', postId));
        if (postDoc.exists()) {
          feedPosts.push({
            id: postDoc.id,
            ...postDoc.data()
          });
        }
      }
      
      // Sort posts by timestamp 
      userFeed.value = feedPosts.sort((a, b) => 
        b.timestamp.toMillis() - a.timestamp.toMillis()
      );
    }
  } catch (error) {
    console.error('Error loading user feed:', error);
  }
};


const loadPublicPosts = async () => {
  try {
    const postsQuery = query(
      collection(firestore, 'posts'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(postsQuery);
    publicPosts.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error loading public posts:', error);
  }
};

// Loads suggested users to follow and filters users being folllowed
const loadSuggestedUsers = async () => {
  try {
    // Get all users 
    const usersQuery = query(collection(firestore, 'users'), limit(10));
    const querySnapshot = await getDocs(usersQuery);
    
    let allUsers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().email?.split('@')[0] || 'User',
      ...doc.data()
    }));
    
    // Filter out current user and users already being followed
    if (currentUser.value) {
      allUsers = allUsers.filter(user => 
        user.id !== currentUser.value.uid && 
        !following.value.includes(user.id)
      );
    }
    
    // Randomize and take first 5 users
    const shuffled = allUsers.sort(() => 0.5 - Math.random());
    suggestedUsers.value = shuffled.slice(0, 5);
  } catch (error) {
    console.error('Error loading suggested users:', error);
  }
};

//
const createPost = async () => {
  if (!currentUser.value || !newPostContent.value.trim()) return;
  
  try {
    // Create post data object
    const postData = {
      timestamp: new Date(),              
      author: currentUser.value.email,   
      content: newPostContent.value.trim()
    };
    
    // Add post to 'posts' collection
    const postDocRef = await addDoc(collection(firestore, 'posts'), postData);
    
    // Add post to post array
    const userDocRef = doc(firestore, 'users', currentUser.value.uid);
    await updateDoc(userDocRef, {
      posts: arrayUnion(postDocRef.id)
    });
    
    // Add post to all followers feeds
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const followers = userData.followers || [];
      
      // Update each follower's feed with the new post
      for (const followerId of followers) {
        const followerDocRef = doc(firestore, 'users', followerId);
        await updateDoc(followerDocRef, {
          feed: arrayUnion(postDocRef.id)
        });
      }
    }
    
    // Clear the input and refresh data
    newPostContent.value = '';
    await loadUserData();
    await loadUserFeed();
    
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Failed to create post. Please try again.');
  }
};

const handleFollow = async (userId) => {
  if (!currentUser.value || following.value.includes(userId)) return;
  
  try {
    const currentUserDocRef = doc(firestore, 'users', currentUser.value.uid);
    const targetUserDocRef = doc(firestore, 'users', userId);
    
    // Add target user to current user following list
    await updateDoc(currentUserDocRef, {
      following: arrayUnion(userId)
    });
    
    // Add current user to target user's followers list
    await updateDoc(targetUserDocRef, {
      followers: arrayUnion(currentUser.value.uid)
    });
    
    // Add target user's posts to current user's feed
    const targetUserDoc = await getDoc(targetUserDocRef);
    if (targetUserDoc.exists()) {
      const targetUserData = targetUserDoc.data();
      const targetUserPosts = targetUserData.posts || [];
      
      if (targetUserPosts.length > 0) {
        await updateDoc(currentUserDocRef, {
          feed: arrayUnion(...targetUserPosts)
        });
      }
    }
    
    // Refresh local data 
    await loadUserData();
    await loadUserFeed();
    await loadSuggestedUsers();
    
  } catch (error) {
    console.error('Error following user:', error);
    alert('Failed to follow user. Please try again.');
  }
};

const navigateToLogin = () => {
  router.push('/login');
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
  resize: vertical;           
  font-family: inherit;       
}

.post-button {
  background-color: #42b983; 
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.post-button:disabled {
  background-color: #ccc;     
  cursor: not-allowed;
}

.post-button:hover:not(:disabled) {
  background-color: #3aa876;  
}

.login-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;         
  top: 100px;                
}

.login-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;             
}

.login-button:hover {
  background-color: #3aa876;
}
</style>