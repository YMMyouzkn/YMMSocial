/* YMM External Push — Service Worker (يجب أن يكون في جذر الموقع بجانب index.html) */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDTsnFVRRas32lIdqKM8TnglNW1-VYTspQ',
  authDomain: 'ymmai-59c6c.firebaseapp.com',
  projectId: 'ymmai-59c6c',
  storageBucket: 'ymmai-59c6c.firebasestorage.app',
  messagingSenderId: '598941300583',
  appId: '1:598941300583:web:3aa6c28b51f8d6f9ffa1c2'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const data = (payload && payload.data) || {};
  const n = (payload && payload.notification) || {};
  const title = n.title || data.title || 'YMM';
  const options = {
    body: n.body || data.body || '',
    icon: n.icon || data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    image: n.image || data.image || undefined,
    tag: data.tag || 'ymm-push',
    renotify: true,
    requireInteraction: data.requireInteraction === '1' || data.requireInteraction === true,
    data: {
      url: data.url || data.click_action || n.click_action || '/',
      ...data
    },
    vibrate: [120, 80, 120]
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url && 'focus' in client) {
          client.postMessage({ type: 'ymm-notif-click', url: url });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
