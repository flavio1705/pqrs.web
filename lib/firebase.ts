import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcBZ-1y79IFTATHMFpNTggbqykshp9lDs",
  authDomain: "notification-pqrs.firebaseapp.com",
  projectId: "notification-pqrs",
  storageBucket: "notification-pqrs.firebasestorage.app",
  messagingSenderId: "803138245162",
  appId: "1:803138245162:web:844fc0b90d70d5d4dda953",
  measurementId: "G-BPN5MFQY7P"
};

// Inicializar Firebase solo del lado del cliente
const app = typeof window !== 'undefined' ? initializeApp(firebaseConfig) : null;
const messaging = app ? getMessaging(app) : null;

// Tipo para el token FCM
export type FCMToken = string;

// Interface para la notificación
export interface INotification {
  title: string;
  body: string;
  icon?: string;
  click_action?: string;
}

// Función para solicitar permiso y obtener el token FCM
export const requestNotificationPermission = async (): Promise<FCMToken | null> => {
  try {
    if (!messaging) return null;

    // Solicitar permiso al usuario
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Obtener el token FCM
    const token = await getToken(messaging, {
      vapidKey: 'BG7Mnv-pmExuBpCDB2rSmbJQB9MyxyWbnDi1BNVOrZ7EpHLlYVkXdFmeCLwZYrtaNycCwEOfGsL5YFr-a3xTpzY'
    });

    return token;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Función para manejar mensajes en primer plano
export const onMessageListener = () =>
  new Promise<INotification>((resolve) => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      resolve({
        title: payload.notification?.title || '',
        body: payload.notification?.body || '',
        icon: payload.notification?.icon,
        // click_action: payload.notification?.click_action,
      });
    });
  });

// Función para suscribirse a notificaciones enviando el token al backend
export const subscribeToNotifications = async (token: string) => {
  try {
    const response = await fetch('https://l0w2wr04-3000.brs.devtunnels.ms/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Error en la suscripción: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Suscripción exitosa:', data);
  } catch (error) {
    console.error('Error al suscribirse a notificaciones:', error);
  }
};

// Hook personalizado para manejar notificaciones
import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notification, setNotification] = useState<INotification | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // const [isSubscribed, setIsSubscribed] = useState(false);
  let isSubscribed=""
  if (typeof window !== 'undefined') {
    isSubscribed = localStorage.getItem("isSubscribed") || "" 
  }
  useEffect(() => {
    const setupNotifications = async () => {
      if (!isSubscribed) {
        const newToken = await requestNotificationPermission();
        if (newToken) {
          setToken(newToken);
          await subscribeToNotifications(newToken);
          localStorage.setItem("isSubscribed", newToken)
        }
      }
    };

    setupNotifications();

    const unsubscribe = onMessageListener()
      .then((payload: INotification) => {
        setNotification(payload);
      })
      .catch((err) => console.error('Error: ', err));

    return () => {
      unsubscribe;
    };
  }, [isSubscribed]);

  return { notification, token, isSubscribed };
};