import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

if (!getApps().length) {
  try {
    // Solo inicializar si tenemos las variables de entorno (previene crasheos en el build de Vercel)
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

// Exportamos un Getter para evitar que se ejecute en build time
export const getAdminMessaging = () => {
    if (getApps().length > 0) {
        return getMessaging();
    }
    throw new Error('Firebase Admin no inicializado (Faltan env vars)');
}
