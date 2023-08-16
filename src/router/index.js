import { createRouter, createWebHashHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/init';
import store from '../store';
import { getUserApprovalStatus } from '../_helpers/auth';

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },
  { path: '/pending', name: 'Pending', component: () => import('../views/Pending.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/settings', name: 'Settings', component: () => import('../views/Settings.vue'), meta: { requiresAuth: true } },
  {
    path: '/list',
    name: 'List',
    component: () => import('../views/List.vue'),
    children: [
      { path: 'waters', name: 'waters', component: () => import('@/components/Water/WatersList.vue') },
      { path: 'users', name: 'users', component: () => import('@/components/User/UsersList.vue') }
    ],
    meta: { requiresAuth: true, authorizedRoles: ['admin'] },
  },
  {
    path: '/export',
    name: 'Export',
    component: () => import('../views/Export.vue'),
    meta: { requiresAuth: true, authorizedRoles: ['admin', 'chief'] },
  },
];

// Create the Vue Router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


// Handle changes in authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Load user roles from authentication data
    await store.dispatch('setUserRolesFromAuth', user.uid);
    store.commit('setLoggedIn', true);
  } else {
    // No user authenticated, reset user roles and login status
    store.commit('setLoggedIn', false);
    store.commit('setUserRoles', { isAdmin: false, isChief: false });
  }
  
  // Cache the current user's authentication state
  await store.dispatch('cacheCurrentUser');
  
  // Done handling authentication state, set loading to false
  store.commit('setLoading', false);
});

// Vue Router navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (store.state.loading) {
    // Wait for loading to finish before continuing
    await new Promise(resolve => {
      const unsubscribe = store.subscribe(() => {
        if (!store.state.loading) {
          unsubscribe();
          resolve();
        }
      });
    });
  }

  if (requiresAuth) {
    if (!store.state.isLoggedIn) {
      // Redirect to login if not logged in
      next({ name: 'Login' });
      return;
    }

    const currentUser = store.state.currentUser;

    if (!currentUser) {
      // Redirect to login if user data is missing
      next({ name: 'Login' });
    } else {
      const isApproved = await getUserApprovalStatus(currentUser.uid);

      if (!isApproved) {
        // Redirect to pending if user is not approved
        next({ name: 'Pending' });
      } else {
        const userRole = store.state.userRoles;

        if (to.meta.authorizedRoles && !to.meta.authorizedRoles.some(role => userRole[role === 'chief' ? 'isChief' : 'isAdmin'])) {
          // Redirect to home if unauthorized role
          next({ name: 'Home' });
        } else {
          // Authorized role, proceed to destination
          next();
        }
      }
    }
  } else {
    // No authentication required, proceed
    next();
  }
});

export default router;
