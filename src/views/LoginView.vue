
<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Login Form -->
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
        <p class="switch-text">Don't have an account? <a @click="currentView = 'create'">Create one</a></p>
      </div>

      <!-- Create Account Form -->
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
        <p class="switch-text">Already have an account? <a @click="currentView = 'login'">Log in</a></p>
      </div>

      <!-- Logged In View -->
      <div v-if="isLoggedIn" class="logged-in-view">
        <h2>Welcome!</h2>
        <p>You are logged in as {{ currentUser }}</p>
        <button @click="handleLogout" class="logout-btn">Log Out</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form state
const currentView = ref('login');
const loginEmail = ref('');
const loginPassword = ref('');
const createEmail = ref('');
const createPassword = ref('');

// Auth state
const isLoggedIn = ref(false);
const currentUser = ref('');

// Mock user
const validUser = {
  email: 'test@ucr.edu',
  password: 'password123'
};

// Check auth status on mount
onMounted(() => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    isLoggedIn.value = true;
    currentUser.value = savedUser;
  }
});

// Handle login
const handleLogin = () => {
  if (loginEmail.value === validUser.email && loginPassword.value === validUser.password) {
    localStorage.setItem('currentUser', loginEmail.value);
    isLoggedIn.value = true;
    currentUser.value = loginEmail.value;
    router.push('/');
  } else {
    alert('Invalid credentials');
    loginPassword.value = '';
  }
};

// Handle account creation
const handleCreateAccount = () => {
  if (createEmail.value && createPassword.value) {
    localStorage.setItem('currentUser', createEmail.value);
    isLoggedIn.value = true;
    currentUser.value = createEmail.value;
    router.push('/');
  }
};

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('currentUser');
  isLoggedIn.value = false;
  currentUser.value = '';
  currentView.value = 'login';
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
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