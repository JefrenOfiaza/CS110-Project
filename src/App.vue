<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'

</script>

<template>
 <Navigation /> 
 <RouterView/>
  
</template>

<style>
/* Global styles */
body {
  background-color: #f8f9fa; 
  color: #333; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
}

/* Basic text contrast */
h1, h2, h3, h4 {
  color: #2c3e50; 
}

/* Links */
a {
  color: #42b983; 
  text-decoration: none;
}


.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* Forms */
input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
