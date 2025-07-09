// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import UserProfileView from '../views/UserProfileView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/users/:id',
    name: 'user-profile',
    component: UserProfileView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;