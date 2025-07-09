<!-- src/components/Navigation.vue -->
<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';

const isLoggedIn = ref(false);
const currentUser = ref('');

// Check login status
const checkAuthStatus = () => {
  const savedUser = localStorage.getItem('currentUser');
  isLoggedIn.value = !!savedUser;
  currentUser.value = savedUser || '';
};

onMounted(checkAuthStatus);

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('currentUser');
  isLoggedIn.value = false;
  currentUser.value = '';
  window.location.reload(); // Refresh to update all views
};
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <nav>
        <ul class="nav-list">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <RouterLink to="/login" class="nav-link">Login</RouterLink>
          </li>
          <li v-else class="nav-item">
            <button @click="handleLogout" class="nav-link logout-btn">Log Out</button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: #2c3e50;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1rem;
}

.nav-item {
  margin: 0;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 1rem;
  display: inline-block;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.router-link-active {
  background-color: #42b983;
  font-weight: bold;
}

.logout-btn {
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
  color: white;
}

.logout-btn:hover {
  color: #ff4444;
}
</style>