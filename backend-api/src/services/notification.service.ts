import admin from 'firebase-admin';

// Initialize Firebase Admin (requires serviceAccountKey.json)
// if (process.env.FIREBASE_CONFIG) {
//   const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
// }

export const sendPushNotification = async (token: string, title: string, body: string, data?: any) => {
  if (!token) return;

  const message = {
    notification: { title, body },
    token,
    data: data || {},
  };

  try {
    // const response = await admin.messaging().send(message);
    console.log('Successfully sent message (Simulation):', title);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

export const broadcastAlert = async (topic: string, title: string, body: string, data?: any) => {
    // Send to a specific topic (e.g. 'bukavu-alerts')
    try {
        console.log(`Broadcasting to ${topic} (Simulation):`, title);
        return true;
    } catch (error) {
        console.error('Error broadcasting message:', error);
        return false;
    }
};
