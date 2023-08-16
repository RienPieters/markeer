import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { initFirebase } from './firebase/init';
import store from './store';

createApp(App)
.use(store)
.use(router)
.provide('initFirebase', initFirebase)
.mount('#app');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
