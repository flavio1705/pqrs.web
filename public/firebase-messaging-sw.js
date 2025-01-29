importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBcBZ-1y79IFTATHMFpNTggbqykshp9lDs",
    authDomain: "notification-pqrs.firebaseapp.com",
    projectId: "notification-pqrs",
    storageBucket: "notification-pqrs.firebasestorage.app",
    messagingSenderId: "803138245162",
    appId: "1:803138245162:web:844fc0b90d70d5d4dda953",
    measurementId: "G-BPN5MFQY7P"
});

const messaging = firebase.messaging();

// Manejar notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png', // Tu ícono de notificación
    badge: '/badge.png', // Tu badge de notificación
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});