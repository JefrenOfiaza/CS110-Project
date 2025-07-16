<template>
  <div class="login-container">
    <div class="login-box">
      
      <!-- Shows when user wants to log in -->
      <div v-if="!isLoggedIn && currentView === 'login'" class="auth-form">
        <h2>Log In</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <input v-model="loginEmail" type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input v-model="loginPassword" type="password" placeholder="Password" required>
          </div>
          <button type="submit" class="submit-btn">Log In</button>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p class="switch-text">Don't have an account? <a @click="currentView = 'create'">Create one</a></p>
      </div>

      <!-- Shows when user wants to sign up -->
      <div v-if="!isLoggedIn && currentView === 'create'" class="auth-form">
        <h2>Create Account</h2>
        <form @submit.prevent="handleCreateAccount">
          <div class="form-group">
            <input v-model="createEmail" type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input v-model="createPassword" type="password" placeholder="Password" required>
          </div>
          <button type="submit" class="submit-btn">Create Account</button>
        </form>
        <!-- Show error message if account creation fails -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p class="switch-text">Already have an account? <a @click="currentView = 'login'">Log in</a></p>
      </div>

      <div v-if="isLoggedIn" class="logged-in-view">
        <h2>Welcome!</h2>
        <p>You are logged in as {{ currentUser?.email }}</p>
        <button @click="handleLogout" class="logout-btn">Log Out</button>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebaseResources';

const router = useRouter();

const currentView = ref('login'); // 'login' or 'create'
const loginEmail = ref('');
const loginPassword = ref('');
const createEmail = ref('');
const createPassword = ref('');
const errorMessage = ref('');   
const isLoggedIn = ref(false);
const currentUser = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      currentUser.value = user;
    } else {
      isLoggedIn.value = false;
      currentUser.value = null;
    }
  });
});

const handleLogin = async () => {
  errorMessage.value = '';     // Clear previous errors
  
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      loginEmail.value, 
      loginPassword.value
    );
    
    currentUser.value = userCredential.user;
    isLoggedIn.value = true;
    
    // Redirect to home page
    router.push('/');
    
  } catch (error) {
    errorMessage.value = 'Invalid email or password';
    // Clear password 
    loginPassword.value = '';
    console.error('Login error:', error);
  }
};

const handleCreateAccount = async () => {
  errorMessage.value = '';
  
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      createEmail.value, 
      createPassword.value
    );
    const user = userCredential.user;

    await setDoc(doc(firestore, 'users', user.uid), {
      email: user.email,        
      feed: [],                    
      followers: [],             
      following: [],             
      posts: []                    
    });
  
    currentUser.value = user;
    isLoggedIn.value = true;
    
    // Redirect to home page
    router.push('/');
    
  } catch (error) {
    errorMessage.value = 'Account creation failed. Please try again.';
    // Clear password field
    createPassword.value = '';
    console.error('Account creation error:', error);
  }
};

const handleLogout = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    
    // Reset local state
    isLoggedIn.value = false;
    currentUser.value = null;
    currentView.value = 'login';
    
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;          
  background-color: #f5f5f5;  
}

.login-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  
  padding: 2rem;
  width: 100%;
  max-width: 400px;           
}

.auth-form {
  display: flex;
  flex-direction: column;     
  gap: 1.5rem;               
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.submit-btn {
  padding: 0.75rem;
  background-color: #42b983;  
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #3aa876;  
}

.error-message {
  color: #ff4444;            
  text-align: center;
  margin: 0;
}

.switch-text {
  text-align: center;
  margin-top: 1rem;
}

.switch-text a {
  color: #42b983;             
  cursor: pointer;
}

.logged-in-view {
  text-align: center;
  padding: 1rem;
}

.logout-btn {
  background-color: #ff4444;  
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
}
</style>