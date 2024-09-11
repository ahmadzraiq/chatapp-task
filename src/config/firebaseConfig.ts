import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyB8KZNAXCAF6uO8AalCrSHKaFAy1gqRdn8",
  authDomain: "voizzit-task.firebaseapp.com",
  projectId: "voizzit-task",
  storageBucket: "voizzit-task.appspot.com",
  messagingSenderId: "505021873605",
  appId: Platform.OS === "ios" ? "1:505021873605:ios:b51d0f583050d3adc35fac" : "1:505021873605:android:dba45a3d8cdc8fcec35fac",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
