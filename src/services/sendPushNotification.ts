import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const sendPushNotification = async (message: string) => {
  const tokens: string[] = [];

  // Fetch all users' push tokens from Firestore
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.pushToken) {
      tokens.push(data.pushToken); // Collect tokens
    }
  });

  // Expo Push Notifications API URL
  const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";

  const messages = tokens.map(token => ({
    to: token,
    sound: "default",
    title: "New Message",
    body: message,
    data: { message },
  }));

  // Split into batches of 100 (Expo only allows 100 messages per request)
  const chunks = [];
  while (messages.length) {
    chunks.push(messages.splice(0, 100)); // Expo allows max 100 messages per request
  }

  // Send notifications in batches
  for (const chunk of chunks) {
    try {
      await fetch(expoPushEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });
    } catch (error) {
      console.error("Error sending notification: ", error);
    }
  }
};

export default sendPushNotification;
