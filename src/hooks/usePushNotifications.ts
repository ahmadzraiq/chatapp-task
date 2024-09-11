import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { db } from "../config/firebaseConfig";

export const usePushNotifications = (userId: string | undefined) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  // Register for push notifications
  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notifications!");
        return;
      }

      const tokenRes = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas.projectId,
      });
      token = tokenRes.data;
    } else {
      // alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  useEffect(() => {
    if (userId) {
      registerForPushNotificationsAsync().then(async token => {
        if (token) {
          setExpoPushToken(token);
          // Save push token to Firestore inside the user's document
          const userRef = doc(db, "users", userId);
          await setDoc(userRef, { pushToken: token }, { merge: true });
        }
      });

      // Foreground notification listener
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log("Notification received: ", notification);
      });

      // Response listener for user interaction with notification
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log("Notification response: ", response);
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [userId]);

  return expoPushToken;
};
